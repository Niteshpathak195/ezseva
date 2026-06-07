"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolPageShell from "../components/tools/ToolPageShell";
import ToolWorkflowCTA from "../components/tools/ToolWorkflowCTA";
import { isPdfFile } from "../lib/file-validation";
import { isPdfEncrypted, unlockPdfBytes, getPdfPageCount } from "../lib/pdf-unlock";

type UnlockStatus = "idle" | "unlocking" | "done" | "error";

interface UnlockResult {
  name: string;
  originalBytes: number;
  outputBytes: number;
  pageCount: number;
}

function fmtSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target!.result as ArrayBuffer);
    r.onerror = () => reject(new Error("Read failed"));
    r.readAsArrayBuffer(file);
  });
}

export default function PdfUnlockPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [isEncrypted, setIsEncrypted] = useState<boolean | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [metaError, setMetaError] = useState("");

  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [status, setStatus] = useState<UnlockStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<UnlockResult | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadURLRef = useRef<string | null>(null);

  const MAX_SIZE = 50 * 1024 * 1024;

  useEffect(() => {
    return () => {
      if (downloadURLRef.current) URL.revokeObjectURL(downloadURLRef.current);
    };
  }, []);

  const loadFile = useCallback(async (f: File) => {
    if (!isPdfFile(f)) {
      setMetaError("Please select a valid PDF file (.pdf).");
      return;
    }
    if (f.size > MAX_SIZE) {
      setMetaError("File too large. Max 50 MB.");
      return;
    }

    setMetaError("");
    setErrorMsg("");
    setResult(null);
    setPassword("");
    setStatus("idle");
    setFile(f);
    setLoadingMeta(true);

    if (downloadURLRef.current) {
      URL.revokeObjectURL(downloadURLRef.current);
      downloadURLRef.current = null;
    }

    try {
      const buf = await readFileAsArrayBuffer(f);
      const bytes = new Uint8Array(buf);
      setFileBytes(bytes);

      const encrypted = await isPdfEncrypted(bytes);
      setIsEncrypted(encrypted);

      if (encrypted) {
        setPageCount(0);
      } else {
        setPageCount(await getPdfPageCount(bytes));
      }
    } catch {
      setMetaError("Could not read PDF. File may be corrupt.");
      setFile(null);
      setFileBytes(null);
      setPageCount(0);
      setIsEncrypted(null);
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  const onZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const onZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };
  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    e.target.value = "";
  };

  const handleUnlock = useCallback(async () => {
    if (!file || !fileBytes) {
      setErrorMsg("Please upload a PDF first.");
      return;
    }
    if (isEncrypted && !password) {
      setErrorMsg("Please enter the PDF password.");
      return;
    }

    setErrorMsg("");
    setStatus("unlocking");
    setProgress(10);
    setProgressMsg("Reading PDF…");

    try {
      const unlockedBytes = await unlockPdfBytes(
        fileBytes,
        isEncrypted ? password : "",
        (pct, msg) => {
          setProgress(pct);
          setProgressMsg(msg);
        }
      );

      if (downloadURLRef.current) URL.revokeObjectURL(downloadURLRef.current);
      const blob = new Blob([unlockedBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      downloadURLRef.current = url;

      const baseName = file.name.replace(/\.pdf$/i, "");
      const outName = `${baseName}_unlocked.pdf`;

      const a = document.createElement("a");
      a.href = url;
      a.download = outName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      const pages = await getPdfPageCount(unlockedBytes);

      setResult({
        name: outName,
        originalBytes: file.size,
        outputBytes: unlockedBytes.byteLength,
        pageCount: pages,
      });

      setPageCount(pages);
      setProgress(100);
      setProgressMsg("Done!");
      setStatus("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unlock failed.";
      setStatus("error");
      if (msg.toLowerCase().includes("incorrect password")) {
        setErrorMsg("Incorrect password. Please check and try again — passwords are case-sensitive.");
      } else if (msg.toLowerCase().includes("password")) {
        setErrorMsg("Password required or incorrect. Enter the same password you use to open this PDF in Adobe/Chrome.");
      } else {
        setErrorMsg(
          "Could not unlock this PDF. If it was protected with EzSeva PDF Protect, ensure the password is exact (no extra spaces). For AES-encrypted PDFs, try again — a fallback method will be used."
        );
      }
    }
  }, [file, fileBytes, isEncrypted, password]);

  const handleDownloadAgain = useCallback(() => {
    if (!downloadURLRef.current || !result) return;
    const a = document.createElement("a");
    a.href = downloadURLRef.current;
    a.download = result.name;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [result]);

  const handleReset = () => {
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setIsEncrypted(null);
    setPassword("");
    setStatus("idle");
    setProgress(0);
    setProgressMsg("");
    setErrorMsg("");
    setResult(null);
    setMetaError("");
    setIsDragOver(false);
    if (downloadURLRef.current) {
      URL.revokeObjectURL(downloadURLRef.current);
      downloadURLRef.current = null;
    }
  };

  return (
    <ToolPageShell toolHref="/pdf-unlock">
      {(errorMsg || metaError) && (
        <div className="alert-error" role="alert" style={{ marginBottom: 16 }}>
          ⚠️ {errorMsg || metaError}
        </div>
      )}

      {!file && (
        <div
          className="ez-tool-workspace upload-zone"
          onDragOver={onZoneDragOver}
          onDragLeave={onZoneDragLeave}
          onDrop={onZoneDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF"
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          style={{
            marginBottom: 16,
            borderColor: isDragOver ? "var(--brand)" : undefined,
            background: isDragOver ? "var(--brand-light)" : undefined,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ display: "none" }}
            onChange={onFileInput}
          />
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔓</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            Drag & drop a password-protected PDF, or click to browse
          </p>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
            PDF only · up to 50 MB · processed locally
          </p>
        </div>
      )}

      {loadingMeta && (
        <div style={{ textAlign: "center", padding: 20, color: "var(--text-muted)", fontSize: 13 }}>
          ⏳ Analysing PDF…
        </div>
      )}

      {file && !loadingMeta && status !== "done" && status !== "unlocking" && (
        <>
          <div
            style={{
              background: "#fff",
              border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)",
              padding: "14px 18px",
              marginBottom: 14,
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 24 }}>📄</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {fmtSize(file.size)}
                {pageCount > 0 ? ` · ${pageCount} page${pageCount !== 1 ? "s" : ""}` : ""}
                {isEncrypted === true && (
                  <span style={{ color: "var(--accent)", fontWeight: 700, marginLeft: 8 }}>
                    🔐 Password protected
                  </span>
                )}
                {isEncrypted === false && (
                  <span style={{ color: "var(--brand)", fontWeight: 700, marginLeft: 8 }}>
                    ✓ Not encrypted
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleReset}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--text-hint)",
                fontWeight: 700,
              }}
            >
              ✕ Remove
            </button>
          </div>

          {isEncrypted === false && (
            <div
              className="alert-success"
              role="status"
              style={{ marginBottom: 14, fontSize: 13 }}
            >
              ℹ️ This PDF has no password. You can still download a clean copy without encryption metadata.
            </div>
          )}

          {isEncrypted && (
            <div
              style={{
                background: "#fff",
                border: "1.5px solid var(--border-light)",
                borderRadius: "var(--radius-xl)",
                padding: 20,
                marginBottom: 14,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <label
                htmlFor="pdf-unlock-pwd"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                PDF Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="pdf-unlock-pwd"
                  type={showPwd ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the password used to open this PDF"
                  autoComplete="current-password"
                  style={{ width: "100%", paddingRight: 44 }}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-hint)", marginTop: 8 }}>
                Your password stays on this device — never sent to EzSeva servers.
              </p>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleUnlock}
            style={{ width: "100%", marginBottom: 16, fontSize: 15, padding: 15, fontWeight: 800 }}
          >
            🔓 {isEncrypted ? "Unlock & Download PDF" : "Download Clean Copy"}
          </button>
        </>
      )}

      {status === "unlocking" && (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid var(--border-light)",
            borderRadius: "var(--radius-xl)",
            padding: "24px 20px",
            marginBottom: 16,
            textAlign: "center",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
            {progressMsg || "Unlocking PDF…"}
          </p>
          <div className="progress-bar-wrap" style={{ marginBottom: 8 }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
            />
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{progress}%</p>
        </div>
      )}

      {status === "done" && result && (
        <div
          style={{
            background: "#fff",
            border: "2px solid var(--brand-border)",
            borderRadius: "var(--radius-xl)",
            padding: 24,
            marginBottom: 20,
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 6 }}>✅</div>
            <h2 style={{ fontSize: 19, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
              PDF Unlocked!
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {result.pageCount} page{result.pageCount !== 1 ? "s" : ""} · {fmtSize(result.outputBytes)}
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={handleDownloadAgain}
            style={{ width: "100%", marginBottom: 10, fontSize: 14, padding: 13, fontWeight: 800 }}
          >
            ⬇️ Download Again — {result.name}
          </button>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-secondary" onClick={handleReset}>
              🔓 Unlock Another PDF
            </button>
            <a href="/" className="btn-secondary" style={{ textDecoration: "none" }}>
              🏠 Back to Home
            </a>
          </div>
        </div>
      )}

      <div aria-hidden="true" style={{ margin: "24px 0" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "250px" }}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      <section
        style={{
          background: "#fff",
          border: "1.5px solid var(--border-light)",
          borderRadius: "var(--radius-xl)",
          padding: 22,
          marginBottom: 14,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>
          🪄 How to Remove PDF Password
        </h2>
        {[
          { n: "1", title: "Upload PDF", desc: "Select your password-protected PDF (salary slip, bank statement, Aadhaar, etc.)." },
          { n: "2", title: "Enter Password", desc: "Type the password you use to open the file in Adobe Reader or Chrome." },
          { n: "3", title: "Unlock & Download", desc: "Click Unlock. A new PDF without password protection downloads automatically." },
          { n: "4", title: "Use Other Tools", desc: "Now compress, merge, or split the unlocked PDF with other EzSeva tools." },
        ].map(({ n, title, desc }) => (
          <div key={n} style={{ display: "flex", gap: 12, marginBottom: 13, alignItems: "flex-start" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "var(--brand)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {n}
            </span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                {title}
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          background: "#fff",
          border: "1.5px solid var(--border-light)",
          borderRadius: "var(--radius-xl)",
          padding: 22,
          marginBottom: 14,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>
          ❓ Frequently Asked Questions
        </h2>
        {[
          {
            q: "Is PDF unlock free?",
            a: "Yes — completely free, no signup, no limits. Works on desktop and mobile browsers.",
          },
          {
            q: "Does EzSeva store my password or PDF?",
            a: "No. Unlocking happens 100% in your browser using pdf-lib. Your file and password never leave your device.",
          },
          {
            q: "Why unlock before compress or merge?",
            a: "Password-protected PDFs cannot be processed by compress, merge, or split tools. Unlock first, then use those tools.",
          },
          {
            q: "What if I forgot the password?",
            a: "EzSeva cannot recover lost passwords. You need the correct password that opens the file in a PDF reader.",
          },
          {
            q: "Will unlocking reduce quality?",
            a: "Text may become image-based in the output (standard for browser unlock tools). Visual content is preserved at high resolution. For editable text PDFs, use desktop software with full decryption.",
          },
          {
            q: "Does it work on PDFs protected with EzSeva PDF Protect?",
            a: "Yes. PDFs encrypted with EzSeva PDF Protect can be unlocked here using the same password you set.",
          },
        ].map((faq, i, arr) => (
          <div
            key={faq.q}
            style={{
              marginBottom: i < arr.length - 1 ? 16 : 0,
              paddingBottom: i < arr.length - 1 ? 16 : 0,
              borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none",
            }}
          >
            <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5 }}>
              Q: {faq.q}
            </p>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <ToolWorkflowCTA
        steps={[
          { label: "Compress PDF", href: "/pdf-compress" },
          { label: "Merge PDFs", href: "/pdf-merge" },
          { label: "Protect again", href: "/pdf-protect" },
        ]}
      />
    </ToolPageShell>
  );
}
