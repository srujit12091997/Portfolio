"use strict";

var http = require("http");
var path = require("path");
var fs = require("fs");
var crypto = require("crypto");
var nodemailer = require("nodemailer");

var fsp = fs.promises;

function loadDotEnvFile() {
  var envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  var content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach(function (line) {
    var trimmed = String(line || "").trim();
    if (!trimmed || trimmed.charAt(0) === "#") {
      return;
    }

    var delimiterIndex = trimmed.indexOf("=");
    if (delimiterIndex < 1) {
      return;
    }

    var key = trimmed.slice(0, delimiterIndex).trim();
    var value = trimmed.slice(delimiterIndex + 1).trim();

    if ((value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
      (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'")) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadDotEnvFile();

var HOST = process.env.HOST || "127.0.0.1";
var PORT = Number(process.env.PORT || 3000);
var ROOT_DIR = __dirname;
var DATA_DIR = path.join(ROOT_DIR, "data");
var SUBMISSIONS_FILE = path.join(DATA_DIR, "contact-submissions.jsonl");
var MAX_BODY_BYTES = 16 * 1024;
var CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "sanju.techniki@gmail.com";
var SMTP_HOST = process.env.SMTP_HOST || "";
var SMTP_PORT = Number(process.env.SMTP_PORT || 465);
var SMTP_SECURE = String(process.env.SMTP_SECURE || "true").toLowerCase() === "true";
var SMTP_USER = process.env.SMTP_USER || "";
var SMTP_PASS = process.env.SMTP_PASS || "";
var SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER || CONTACT_TO_EMAIL;
var mailTransport = null;

var MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(text);
}

function isEmailConfigured() {
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_TO_EMAIL);
}

function getMailTransport() {
  if (!mailTransport) {
    mailTransport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return mailTransport;
}

async function sendContactEmail(submission) {
  if (!isEmailConfigured()) {
    var configError = new Error("Email delivery is not configured on this server.");
    configError.code = "EMAIL_NOT_CONFIGURED";
    throw configError;
  }

  var subject = "New portfolio contact form submission";
  var text = [
    "New message received from your portfolio contact form.",
    "",
    "Name: " + submission.name,
    "Email: " + submission.email,
    "",
    "Message:",
    submission.message,
    "",
    "Submission ID: " + submission.id,
    "Received At: " + submission.receivedAt,
    "IP: " + submission.ip,
  ].join("\n");

  await getMailTransport().sendMail({
    from: SMTP_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    replyTo: submission.email,
    subject: subject,
    text: text,
  });
}

function getClientIp(request) {
  var forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return request.socket && request.socket.remoteAddress
    ? request.socket.remoteAddress
    : "";
}

function safeResolveStaticPath(pathname) {
  var decodedPath = decodeURIComponent(pathname);
  var normalizedPath = path.normalize(decodedPath).replace(/^([.][.][\\/])+/, "");
  var relativePath = normalizedPath === path.sep ? "index.html" : normalizedPath.replace(/^[\\/]+/, "");
  var absolutePath = path.resolve(ROOT_DIR, relativePath || "index.html");

  if (!absolutePath.startsWith(path.resolve(ROOT_DIR))) {
    return null;
  }

  return absolutePath;
}

function readBody(request) {
  return new Promise(function (resolve, reject) {
    var totalBytes = 0;
    var chunks = [];

    request.on("data", function (chunk) {
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        reject(new Error("Payload too large."));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", function () {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", function (error) {
      reject(error);
    });
  });
}

function validateContactPayload(payload) {
  var name = String((payload && payload.name) || "").trim();
  var email = String((payload && payload.email) || "").trim();
  var message = String((payload && payload.message) || "").trim();
  var errors = [];

  if (!name) {
    errors.push("Name is required.");
  } else if (name.length > 120) {
    errors.push("Name must be 120 characters or fewer.");
  }

  if (!email) {
    errors.push("Email is required.");
  } else if (email.length > 254) {
    errors.push("Email must be 254 characters or fewer.");
  } else {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Please provide a valid email address.");
    }
  }

  if (!message) {
    errors.push("Message is required.");
  } else if (message.length > 5000) {
    errors.push("Message must be 5000 characters or fewer.");
  }

  return {
    errors: errors,
    data: {
      name: name,
      email: email,
      message: message,
    },
  };
}

async function appendSubmission(submission) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.appendFile(SUBMISSIONS_FILE, JSON.stringify(submission) + "\n", "utf8");
}

async function handleContactApi(request, response) {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "600",
    });
    response.end();
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  var bodyText;
  try {
    bodyText = await readBody(request);
  } catch (error) {
    sendJson(response, 413, { ok: false, error: "Request body is too large." });
    return;
  }

  var parsed;
  try {
    parsed = bodyText ? JSON.parse(bodyText) : {};
  } catch (error) {
    sendJson(response, 400, { ok: false, error: "Invalid JSON payload." });
    return;
  }

  var validation = validateContactPayload(parsed);
  if (validation.errors.length) {
    sendJson(response, 400, {
      ok: false,
      error: validation.errors[0],
      errors: validation.errors,
    });
    return;
  }

  var submission = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    ip: getClientIp(request),
    userAgent: String(request.headers["user-agent"] || ""),
    name: validation.data.name,
    email: validation.data.email,
    message: validation.data.message,
  };

  var emailConfigured = isEmailConfigured();
  var emailSent = false;
  var emailSkipped = false;
  var emailError = "";

  if (!emailConfigured) {
    emailSkipped = true;
    emailError = "Email delivery is not configured on this server.";
  } else {
    try {
      await sendContactEmail(submission);
      emailSent = true;
    } catch (error) {
      emailError = error && error.message ? String(error.message) : "Email delivery failed.";
    }
  }

  submission.emailDelivery = {
    configured: emailConfigured,
    sent: emailSent,
    skipped: emailSkipped,
    to: CONTACT_TO_EMAIL,
    attemptedAt: new Date().toISOString(),
    error: emailError,
  };

  try {
    await appendSubmission(submission);
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: "Could not save your message right now.",
    });
    return;
  }

  if (!emailSent && !emailSkipped) {
    sendJson(response, 503, {
      ok: false,
      error: emailError || "Message saved but email delivery failed.",
      submissionId: submission.id,
    });
    return;
  }

  if (emailSkipped) {
    sendJson(response, 201, {
      ok: true,
      message: "Message received. Email delivery is currently disabled on this server.",
      submissionId: submission.id,
      emailSent: false,
    });
    return;
  }

  sendJson(response, 201, {
    ok: true,
    message: "Message received and emailed successfully.",
    submissionId: submission.id,
    emailSent: true,
  });
}

async function handleStaticRequest(request, response, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendText(response, 405, "Method not allowed.");
    return;
  }

  var filePath = safeResolveStaticPath(pathname === "/" ? "/index.html" : pathname);
  if (!filePath) {
    sendText(response, 403, "Forbidden.");
    return;
  }

  var fileStat;
  try {
    fileStat = await fsp.stat(filePath);
  } catch (error) {
    sendText(response, 404, "Not found.");
    return;
  }

  if (!fileStat.isFile()) {
    sendText(response, 404, "Not found.");
    return;
  }

  var extension = path.extname(filePath).toLowerCase();
  var contentType = MIME_TYPES[extension] || "application/octet-stream";

  response.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": fileStat.size,
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
}

async function requestHandler(request, response) {
  var url = new URL(request.url, "http://localhost");
  var pathname = url.pathname;

  if (pathname === "/api/contact") {
    await handleContactApi(request, response);
    return;
  }

  if (pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      status: "up",
      time: new Date().toISOString(),
      emailConfigured: isEmailConfigured(),
      emailTarget: CONTACT_TO_EMAIL,
    });
    return;
  }

  await handleStaticRequest(request, response, pathname);
}

var server = http.createServer(function (request, response) {
  requestHandler(request, response).catch(function (error) {
    console.error("Unhandled server error:", error);
    sendJson(response, 500, { ok: false, error: "Internal server error." });
  });
});

server.listen(PORT, HOST, function () {
  console.log("Portfolio server running at http://" + HOST + ":" + PORT);
  if (!isEmailConfigured()) {
    console.warn("Email delivery is disabled. Configure SMTP_* values in .env to enable it.");
  }
});
