import { NextResponse } from "next/server";

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  url: string;
  lastUpdated: string;
}

export async function GET() {
  try {
    // 실제 두나무 채용 페이지 스크래핑
    const response = await fetch("https://www.dunamu.com/careers/jobs", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jobs page");
    }

    const html = await response.text();

    // Frontend 관련 채용공고 필터링 - JSON 데이터에서 추출
    const frontendJobs: Job[] = [];
    const lines = html.split("\n"); // 디버그용

    try {
      // __NEXT_DATA__ 스크립트에서 JSON 데이터 추출
      const nextDataMatch = html.match(
        /<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/
      );

      if (nextDataMatch && nextDataMatch[1]) {
        const jsonData = JSON.parse(nextDataMatch[1]);
        const articles = jsonData?.props?.pageProps?.articles?.content || [];

        // Frontend가 포함된 채용공고 찾기
        articles.forEach((article: Record<string, unknown>, index: number) => {
          if (
            typeof article.title === "string" &&
            article.title.toLowerCase().includes("frontend")
          ) {
            const jobId = article.id || index + 1;
            const detailUrl = `https://www.dunamu.com/careers/jobs/${jobId}`;

            frontendJobs.push({
              id: jobId.toString(),
              title: article.title,
              department:
                (article.categoryDisplayName as string) || "Engineering",
              type: "정규직",
              url: detailUrl,
              lastUpdated:
                typeof article.createdAt === "string"
                  ? article.createdAt.split("T")[0]
                  : new Date().toISOString().split("T")[0],
            });
          }
        });
      }
    } catch (error) {
      console.error("JSON parsing error:", error);
      // JSON 파싱 실패시 빈 배열 유지
    }

    return NextResponse.json({
      success: true,
      jobs: frontendJobs,
      lastChecked: new Date().toISOString(),
      source: "scraped",
      debug: {
        totalLines: lines.length,
        frontendLinesFound: lines.filter((line) =>
          line.toLowerCase().includes("frontend")
        ).length,
        sampleFrontendLines: lines
          .filter((line) => line.toLowerCase().includes("frontend"))
          .slice(0, 3),
        htmlLength: html.length,
      },
    });
  } catch (error) {
    console.error("Error scraping Dunamu jobs:", error);

    return NextResponse.json({
      success: false,
      jobs: [],
      lastChecked: new Date().toISOString(),
      source: "error",
      error: "Scraping failed",
    });
  }
}
