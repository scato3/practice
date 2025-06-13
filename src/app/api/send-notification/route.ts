import { NextResponse } from "next/server";

interface Job {
  id: string;
  title: string;
  department: string;
  url: string;
  createdAt?: string;
}

export async function POST(request: Request) {
  try {
    const { newJobs } = await request.json();

    if (!newJobs || newJobs.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No new jobs to notify",
      });
    }

    // 이메일 내용 생성
    const emailContent = generateEmailContent(newJobs);

    // 실제 이메일 발송 (여러 옵션 중 선택)
    const result = await sendEmail(emailContent, newJobs);

    return NextResponse.json({
      success: true,
      message: `Notification sent for ${newJobs.length} new jobs`,
      result,
    });
  } catch (error) {
    console.error("Email notification error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to send notification",
    });
  }
}

function generateEmailContent(jobs: Job[]) {
  const jobList = jobs
    .map(
      (job) => `제목: ${job.title}
날짜: ${job.createdAt || "날짜 정보 없음"}
링크: ${job.url}`
    )
    .join("\n\n");

  return {
    subject: `새로운 두나무 Frontend 채용공고 ${jobs.length}개`,
    text: `새로운 Frontend 채용공고가 올라왔습니다.

${jobList}`,
    html: `<p>새로운 Frontend 채용공고가 올라왔습니다.</p>
<pre>${jobList}</pre>`,
  };
}

async function sendEmail(
  content: { subject: string; text: string; html: string },
  jobs: Job[]
) {
  const toEmail = process.env.NOTIFICATION_EMAIL || "your-email@example.com";

  // 방법 1: Resend (추천)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "noreply@yourdomain.com", // 실제 도메인으로 변경
          to: [toEmail],
          subject: content.subject,
          html: content.html,
        }),
      });

      if (response.ok) {
        return { method: "resend", success: true };
      }
    } catch (error) {
      console.error("Resend failed, trying fallback method", error);
    }
  }

  // 방법 2: 웹훅 (Discord, Slack 등)
  if (process.env.DISCORD_WEBHOOK_URL) {
    try {
      const discordMessage = {
        content: `🚨 **새로운 두나무 Frontend 채용공고!**\n\n${jobs
          .map(
            (job) => `💻 **${job.title}**\n🏢 ${job.department}\n🔗 ${job.url}`
          )
          .join("\n\n")}`,
      };

      const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordMessage),
      });

      if (response.ok) {
        return { method: "discord", success: true };
      }
    } catch (error) {
      console.error("Discord webhook failed", error);
    }
  }

  // 방법 3: 콘솔 로그 (개발용)
  console.log("📧 Email notification (console):", content.subject);
  console.log(content.text);
  return { method: "console", success: true };
}
