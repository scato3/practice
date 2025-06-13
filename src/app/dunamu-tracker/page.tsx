"use client";

import { useState, useEffect } from "react";

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  url: string;
  lastUpdated: string;
}

export default function DunamuTracker() {
  const [frontendJobs, setFrontendJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string>("");

  // 목데이터 제거 - 실제 데이터만 표시

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/scrape-dunamu");
      const data = await response.json();

      if (data.success) {
        setFrontendJobs(data.jobs);
      } else {
        // API 실패시 빈 배열
        setFrontendJobs([]);
      }
      setLastChecked(new Date().toLocaleString("ko-KR"));
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      // 에러시 빈 배열
      setFrontendJobs([]);
      setLastChecked(new Date().toLocaleString("ko-KR"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();

    const interval = setInterval(fetchJobs, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshJobs = () => {
    fetchJobs();
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#2563eb", margin: 0 }}>
          🚀 두나무 Frontend 채용 트래커
        </h1>
        <button
          onClick={refreshJobs}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "새로고침 중..." : "🔄 새로고침"}
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#64748b",
        }}
      >
        <p style={{ margin: "0 0 4px 0" }}>
          📊 총 {frontendJobs.length}개의 Frontend 관련 채용공고
        </p>
        <p style={{ margin: 0 }}>
          🕐 마지막 업데이트: {lastChecked || "로딩 중..."}
        </p>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#64748b",
          }}
        >
          <div
            style={{
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #2563eb",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px auto",
            }}
          ></div>
          채용공고를 확인하는 중...
        </div>
      ) : frontendJobs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#fef3c7",
            borderRadius: "8px",
            color: "#92400e",
          }}
        >
          <h3>😅 현재 Frontend 관련 채용공고가 없습니다</h3>
          <p>새로운 공고가 올라오면 여기에 표시됩니다!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {frontendJobs.map((job) => (
            <div
              key={job.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#1e293b",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  💻 {job.title}
                </h3>
                <span
                  style={{
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {job.type}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                <span>🏢 {job.department}</span>
                <span>📅 {job.lastUpdated}</span>
              </div>

              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
              >
                🔗 지원하기
              </a>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "12px",
          color: "#94a3b8",
        }}
      >
        <p>
          데이터 출처:{" "}
          <a
            href="https://www.dunamu.com/careers/jobs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb" }}
          >
            두나무 채용 페이지
          </a>
        </p>
        <p>⚡ 10분마다 자동 업데이트됩니다</p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
