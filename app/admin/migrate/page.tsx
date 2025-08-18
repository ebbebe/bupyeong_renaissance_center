"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { migrateLocalStorageToSupabase, insertDefaultData } from "@/lib/supabase";

export default function MigratePage() {
  const router = useRouter();
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<{stories: {migrated: number, errors: number}, events: {migrated: number, errors: number}, stamps: {migrated: number, errors: number}} | null>(null);
  const [insertingDefaults, setInsertingDefaults] = useState(false);

  // 인증 체크
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    const authTime = localStorage.getItem("adminAuthTime");
    
    if (!auth || !authTime) {
      router.push("/admin");
      return;
    }
    
    const timeDiff = Date.now() - parseInt(authTime);
    if (timeDiff > 3600000) { // 1시간 초과
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminAuthTime");
      router.push("/admin");
    }
  }, [router]);

  const handleMigration = async () => {
    setMigrating(true);
    try {
      const migrationResults = await migrateLocalStorageToSupabase();
      setResults(migrationResults);
    } catch (error) {
      console.error("Migration error:", error);
      alert("마이그레이션 중 오류가 발생했습니다.");
    } finally {
      setMigrating(false);
    }
  };

  const handleInsertDefaults = async () => {
    setInsertingDefaults(true);
    try {
      await insertDefaultData();
      alert("기본 데이터가 추가되었습니다.");
    } catch (error) {
      console.error("Error inserting defaults:", error);
      alert("기본 데이터 추가 중 오류가 발생했습니다.");
    } finally {
      setInsertingDefaults(false);
    }
  };

  const handleInsertHardcodedData = async () => {
    setInsertingDefaults(true);
    try {
      const { storyAPI } = await import("@/lib/supabase");
      
      // 하드코딩된 스토리 데이터 (간략화)
      const hardcodedStories = [
        {
          category: "A ZONE",
          title: "문화의 거리와 역사",
          subtitle: "상인이 만든 거리, 지켜가는 문화",
          content: [
            "'문화의거리'라는 개념은 1990년부터 한국 사회에 도입되었으며, 이는 초대 문화부 장관인 이어령이 지역의 문화 환경을 개선하기 위한 정책으로 각 지방자치단체에 문화의 거리 조성을 권장한 데에서 비롯되었다.",
            "이와는 다르게 '부평문화의거리'는 행정기관 주도가 아닌, 변화의 필요성을 절실히 느낀 지역 상인들의 자발적인 참여로 시작되었다.",
            "한편, 부평문화의거리는 1955년부터 상권이 형성되기 시작했으며, 1996년 건물주와 세입자들이 '문화의거리 발전추진위원회'를 조직하면서 본격적인 거리 조성 사업이 시작되었다.",
            "거리 내 일부 구역은 과거 '커튼골목'이라 불리던 곳이었으나, 2016년 이후 젊은 세대를 겨냥한 상점들이 입점하면서 '평리단길'로 새롭게 불리게 되었다."
          ],
          image_url: "/images/culture_street.png",
          image_mask: "/images/culture_mask.svg",
          order_index: 1
        },
        {
          category: "A ZONE",
          title: "부평 캐릭터 소개",
          subtitle: "부평구를 대표하는 마스코트",
          content: [
            "부평구의 마스코트는 지역의 특색과 문화를 담은 친근한 캐릭터입니다.",
            "이 캐릭터는 부평의 역사와 현재를 연결하는 상징적인 존재로, 시민들에게 사랑받고 있습니다.",
            "특히 어린이들과 젊은 세대에게 부평에 대한 관심과 애정을 불러일으키는 역할을 하고 있습니다.",
            "앞으로도 부평구의 다양한 행사와 홍보 활동에서 중요한 역할을 담당할 예정입니다."
          ],
          image_url: "/images/culture_street.png",
          image_mask: "/images/culture_mask.svg",
          order_index: 2
        },
        {
          category: "B ZONE",
          title: "역사적 인물",
          subtitle: "부평의 역사를 만든 인물들",
          content: [
            "부평 지역은 한국사의 중요한 무대였으며, 많은 역사적 인물들의 발자취가 남아 있습니다.",
            "조선시대부터 근현대까지 부평과 인연을 맺은 인물들의 이야기가 전해집니다.",
            "이들의 업적과 삶은 오늘날 부평의 정체성을 형성하는 중요한 요소가 되었습니다.",
            "역사적 인물들의 이야기를 통해 부평의 과거와 현재를 이해할 수 있습니다."
          ],
          image_url: "/images/culture_street.png",
          image_mask: "/images/culture_mask.svg",
          order_index: 4
        },
        {
          category: "C ZONE",
          title: "연례 행사",
          subtitle: "매년 열리는 부평의 대표 행사들",
          content: [
            "부평에서는 매년 다양한 연례 행사가 개최되어 시민들과 관광객들에게 즐거움을 선사합니다.",
            "각 행사는 부평의 역사와 문화를 반영하며, 지역 공동체의 결속을 다지는 중요한 역할을 합니다.",
            "봄부터 겨울까지 계절별로 특색 있는 행사들이 진행되어 일 년 내내 활기찬 분위기를 만듭니다.",
            "연례 행사들은 부평의 문화적 전통을 이어가며 새로운 문화를 창조하는 장이 되고 있습니다."
          ],
          image_url: "/images/culture_street.png",
          image_mask: "/images/culture_mask.svg",
          order_index: 7
        },
        {
          category: "D ZONE",
          title: "조선시대",
          subtitle: "부평의 조선시대 역사와 문화",
          content: [
            "조선시대 부평은 경기도의 중요한 지역 중 하나로 다양한 역사적 사건들이 일어났습니다.",
            "조선왕조의 통치 체제 하에서 부평은 농업과 수공업이 발달한 지역이었습니다.",
            "이 시대의 문화유산과 전통이 현재까지 이어져 내려오고 있습니다.",
            "조선시대 부평의 역사를 통해 한국 전통문화의 깊이와 아름다움을 느낄 수 있습니다."
          ],
          image_url: "/images/culture_street.png",
          image_mask: "/images/culture_mask.svg",
          order_index: 10
        }
      ];

      let successCount = 0;
      let errorCount = 0;

      for (const story of hardcodedStories) {
        try {
          await storyAPI.create({
            ...story,
            category_order: story.order_index
          });
          successCount++;
        } catch (error) {
          console.error("Error creating story:", error);
          errorCount++;
        }
      }

      alert(`하드코딩된 스토리 데이터 마이그레이션 완료!\n성공: ${successCount}개\n실패: ${errorCount}개`);
    } catch (error) {
      console.error("Error inserting hardcoded data:", error);
      alert("하드코딩된 데이터 추가 중 오류가 발생했습니다.");
    } finally {
      setInsertingDefaults(false);
    }
  };

  const handleInsertEventData = async () => {
    setInsertingDefaults(true);
    try {
      const { eventAPI } = await import("@/lib/supabase");
      
      // 하드코딩된 이벤트 데이터
      const hardcodedEvents = [
        {
          title: "SUMMER FESTIVAL",
          description: "시원한 여름을 즐기는 부평의 대표 여름 축제입니다. 다양한 공연과 체험 프로그램이 준비되어 있으며, 가족 단위로 즐길 수 있는 콘텐츠가 가득합니다.",
          date: "2024-07-20",
          time: "18:00",
          location: "부평문화의거리 일대",
          image_url: "/images/summer_festival.png",
          is_active: true
        },
        {
          title: "MUSIC Festival",
          description: "다양한 장르의 음악을 한자리에서 만날 수 있는 음악 축제입니다. 지역 아티스트부터 유명 가수까지 다양한 공연이 펼쳐집니다.",
          date: "2024-08-15",
          time: "19:00",
          location: "부평 야외 공연장",
          image_url: "/images/music_festival.png",
          is_active: true
        },
        {
          title: "ELECTRO PARTY",
          description: "젊은 세대를 위한 일렉트로닉 뮤직 파티입니다. DJ들의 화려한 퍼포먼스와 함께 흥겨운 밤을 보낼 수 있습니다.",
          date: "2024-09-10",
          time: "20:00",
          location: "부평 클럽 스트리트",
          image_url: "/images/electro_festival.png",
          is_active: true
        },
        {
          title: "부평 가을 축제",
          description: "가을의 정취를 만끽할 수 있는 부평의 대표 가을 축제입니다. 전통 공연과 현대적인 문화 행사가 어우러진 특별한 행사입니다.",
          date: "2024-10-05",
          time: "14:00",
          location: "부평 중앙공원",
          image_url: "/images/autumn_festival.png",
          is_active: true
        },
        {
          title: "부평 문화 야시장",
          description: "밤이 되면 더욱 활기를 띠는 부평 문화 야시장입니다. 맛있는 음식과 다양한 문화 체험을 동시에 즐길 수 있습니다.",
          date: "2024-11-01",
          time: "18:00",
          location: "부평문화의거리",
          image_url: "/images/night_market.png",
          is_active: true
        },
        {
          title: "겨울 빛 축제",
          description: "부평의 겨울밤을 화려하게 수놓는 빛 축제입니다. 아름다운 일루미네이션과 함께 따뜻한 겨울 추억을 만들어보세요.",
          date: "2024-12-15",
          time: "17:00",
          location: "부평구 전역",
          image_url: "/images/light_festival.png",
          is_active: true
        }
      ];

      let successCount = 0;
      let errorCount = 0;

      for (const event of hardcodedEvents) {
        try {
          await eventAPI.create(event);
          successCount++;
        } catch (error) {
          console.error("Error creating event:", error);
          errorCount++;
        }
      }

      alert(`하드코딩된 이벤트 데이터 마이그레이션 완료!\n성공: ${successCount}개\n실패: ${errorCount}개`);
    } catch (error) {
      console.error("Error inserting event data:", error);
      alert("하드코딩된 이벤트 데이터 추가 중 오류가 발생했습니다.");
    } finally {
      setInsertingDefaults(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">데이터 마이그레이션</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              localStorage → Supabase 마이그레이션
            </h2>
            <p className="text-sm text-gray-600">
              로컬 브라우저에 저장된 데이터를 Supabase 데이터베이스로 이전합니다.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleMigration}
              disabled={migrating}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {migrating ? "마이그레이션 중..." : "마이그레이션 시작"}
            </button>

            <button
              onClick={handleInsertDefaults}
              disabled={insertingDefaults}
              className="w-full px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {insertingDefaults ? "추가 중..." : "기본 데이터 추가"}
            </button>

            <button
              onClick={handleInsertHardcodedData}
              disabled={insertingDefaults}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {insertingDefaults ? "추가 중..." : "하드코딩된 스토리 데이터 추가"}
            </button>

            <button
              onClick={handleInsertEventData}
              disabled={insertingDefaults}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {insertingDefaults ? "추가 중..." : "하드코딩된 이벤트 데이터 추가"}
            </button>
          </div>

          {results && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">마이그레이션 결과</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">스토리:</span>
                  <span className="text-gray-900">
                    {results.stories?.migrated || 0}개 성공, {results.stories?.errors || 0}개 실패
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">이벤트:</span>
                  <span className="text-gray-900">
                    {results.events?.migrated || 0}개 성공, {results.events?.errors || 0}개 실패
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">스탬프:</span>
                  <span className="text-gray-900">
                    {results.stamps?.migrated || 0}개 성공, {results.stamps?.errors || 0}개 실패
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">안내</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>마이그레이션은 기존 데이터를 보존하며 중복되지 않습니다.</li>
                  <li>성공적으로 이전된 데이터는 localStorage에서 자동 삭제됩니다.</li>
                  <li>기본 데이터는 데이터베이스가 비어있을 때만 추가됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}