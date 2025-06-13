import { NextResponse } from "next/server";

interface Job {
  id: string;
  title: string;
  department: string;
  url: string;
  createdAt?: string;
}

let previousJobs: Job[] = [];

export async function GET() {
  try {
    // 현재 공고 가져오기
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/scrape-dunamu`, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current jobs");
    }

    const currentData = await response.json();
    const currentJobs: Job[] = currentData.jobs || [];

    // 새로운 공고 찾기 (이전에 없던 ID들)
    const previousJobIds = new Set(previousJobs.map((job) => job.id));
    const newJobs = currentJobs.filter((job) => !previousJobIds.has(job.id));

    console.log(
      `Previous jobs: ${previousJobs.length}, Current jobs: ${currentJobs.length}, New jobs: ${newJobs.length}`
    );

    // 새로운 공고가 있으면 알림 발송
    if (newJobs.length > 0) {
      try {
        const notificationResponse = await fetch(
          `${baseUrl}/api/send-notification`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newJobs }),
          }
        );

        const notificationResult = await notificationResponse.json();
        console.log("Notification sent:", notificationResult);

        // 현재 상태를 이전 상태로 업데이트
        previousJobs = [...currentJobs];

        return NextResponse.json({
          success: true,
          message: `Found ${newJobs.length} new jobs, notification sent`,
          newJobs,
          notificationResult,
        });
      } catch (notifyError) {
        console.error("Failed to send notification:", notifyError);
        return NextResponse.json({
          success: false,
          error: "Found new jobs but failed to send notification",
          newJobs,
        });
      }
    } else {
      // 새로운 공고가 없어도 상태는 업데이트
      previousJobs = [...currentJobs];

      return NextResponse.json({
        success: true,
        message: "No new jobs found",
        totalJobs: currentJobs.length,
      });
    }
  } catch (error) {
    console.error("Job checking error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to check for new jobs",
    });
  }
}

// 수동으로 이전 상태를 초기화하는 엔드포인트
export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/scrape-dunamu`, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current jobs");
    }

    const currentData = await response.json();
    previousJobs = currentData.jobs || [];

    return NextResponse.json({
      success: true,
      message: `Initialized with ${previousJobs.length} jobs`,
      jobs: previousJobs,
    });
  } catch (error) {
    console.error("Initialization error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to initialize job tracker",
    });
  }
}
