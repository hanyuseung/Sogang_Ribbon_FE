import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { getPlacesByNames } from "@/services/place";
import { Place } from "@/types/place";
import { getSupabaseImageUrl } from "@/lib/supabase-image";

const ribbonItems = [
  {
    label: "카디널리본",
    bg: "bg-[#DA1F1F]",
    text: "text-white",
    desc: "서강대 학생이라면 모를 수 없는, 밥약하기 좋은 친근한 맛집",
  },
  {
    label: "딥레드리본",
    bg: "bg-[#AA1616]",
    text: "text-white",
    desc: "식사에 진심인 미식가들을 위한 메뉴 맛집",
  },
  {
    label: "핑크리본",
    bg: "bg-[#FFE3EC]",
    text: "text-[#D6336C]",
    desc: "관심 있는 사람과 함께 가기 좋은 분위기 맛집",
  },
];

const collaborationItems = [
  {
    placeName: "피제리아 더키",
    title: "서강리본 X 피제리아 더키 🍕",
    body: (
      <>
        2025년 가을 축제 ‘CARDINAL’을 기념해 나흘간 출시한 축제 한정
        신메뉴 ‘서강 카디널 피자’. 서강인의 뜨거운 열정을 담아낸 메뉴
        구성과 전략적인 홍보로, 축제 기간 중 해당 매장에서 가장 높은
        판매량을 기록하는 성과를 거두었습니다.
      </>
    ),
  },
  {
    placeName: "녹기 전에",
    title: "서강리본 X 녹기 전에 🍧",
    body: (
      <>
        서강리본 X 녹기 전에🍧
        <br />
        중간고사 기간, 학우들을 응원하기 위해 출시한 콜라보 아이스크림
        ‘중간고사 응원포션’. 서강리본의 아이덴티션과 &lt;녹기 전에&gt;의
        독창적인 레시피가 만나 ‘커피우유+유자 셔프’ 조합의 특별한 맛을
        선보였습니다.
      </>
    ),
  },
];

function CollaborationCard({
  title,
  body,
  place,
}: {
  title: string;
  body: ReactNode;
  place: Place | undefined;
}) {
  const imageUrl = getSupabaseImageUrl(place?.img_url, {
    width: 720,
    height: 348,
    quality: 65,
  });
  const content = (
    <>
      <h3 className="text-[15px] leading-5 font-black text-[#D6336C] mb-5">
        {title}
      </h3>

      <div className="w-full h-[174px] bg-[#D9D9D9] flex items-center justify-center text-[13px] mb-4 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={place?.name ?? title}
            className="block w-full h-full object-cover"
          />
        ) : (
          <span>대표사진하나</span>
        )}
      </div>

      <p className="text-[13.1px] leading-5 text-[#765260] text-justify">
        {body}
      </p>
    </>
  );

  const className =
    "block rounded-[28px] border border-[#F5A0D3] bg-gradient-to-b from-[#FFD6E5] to-white px-[17px] pt-[25px] pb-[25px] shadow-[0_18px_40px_rgba(214,51,108,0.10)] transition-opacity active:opacity-80";

  if (!place) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={`/map?place=${encodeURIComponent(place.id)}`} className={className}>
      {content}
    </Link>
  );
}

export default async function HomePage() {
  const collaborationPlaces = await getPlacesByNames(
    collaborationItems.map((item) => item.placeName)
  );
  const collaborationPlaceByName = new Map(
    collaborationPlaces.map((place) => [place.name, place])
  );

  return (
    <main className="bg-[#FFF9FB] min-h-screen px-[18px] pt-7 pb-32">
      {/* Hero */}
      <section>
        <span className="inline-flex items-center px-[10px] py-[6px] rounded-full bg-[#FFE3EC] text-[#D6336C] text-[11.6px] font-black mb-[14px]">
          SOGANG RIBBON
        </span>

        <h1 className="text-[31.7px] leading-[39px] tracking-[-1.6px] font-bold text-[#2B1B22] mb-5">
          서강인의
          <br />
          맛집 기억을
          <br />
          리본처럼 묶다
        </h1>
      </section>

      {/* About */}
      <section className="bg-white border border-[#F0B6C9] rounded-[28px] px-5 pt-[13px] pb-6 mt-4">
        <h2 className="text-[22.5px] leading-8 font-bold text-[#2B1B22] mb-5">
          About 서강리본
        </h2>

        <div className="flex justify-center mb-4">
          <div className="relative w-[120px] h-[120px]">
            <Image
              src="/sogangribbon_redver.svg"
              alt="서강리본"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-4 text-[13.1px] leading-5 text-[#765260] text-justify">
          <p>
            서강리본은 2025년 1월, 서강인들의 일상적인 식사 고민을
            해결하고자 첫걸음을 내딛었습니다. 대흥, 신촌, 공덕, 이대 등 학교
            인근의 4대 권역을 중심으로 매주 2회 정기 아카이빙을 지속하며,
            학우들에게 가장 정확하고 알찬 맛집 정보를 전달하고 있습니다.
          </p>

          <p>
            맛뿐만 아니라, 공간이 주는 분위기와 서비스, 그리고 가격까지 식당
            방문에 영향을 미치는 모든 요소를 세심히 고려해 대상을 선정합니다.
            이를 보다 직관적으로 공유하기 위해 서강리본만의 고유한 지표
            ‘리본지수’를 도입하여 활용하고 있습니다.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {ribbonItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span
                className={`shrink-0 inline-flex items-center justify-center h-6 px-[10px] rounded-full text-[10.3px] font-black ${item.bg} ${item.text}`}
              >
                {item.label}
              </span>

              <p className="text-[10.3px] leading-4 font-medium text-black">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Award */}
      <section className="mt-[48px] bg-white border border-[#F0B6C9] rounded-[28px] px-[15px] pt-[15px] pb-[26px]">
        <h2 className="text-[22.5px] leading-8 font-bold text-[#2B1B22] mb-3">
          서강리본어워드 🏆
        </h2>

        <div className="space-y-4 text-[13.1px] leading-5 text-[#765260] text-justify">
          <p>
            “서강대 주변의 다양한 맛집들 중, 서강인의 마음속 ‘진정한
            맛집’은 어디일까?”
          </p>

          <p>
            &lt;서강리본 어워드&gt;는 서강리본의 대표적인 독자 참여형
            콘텐츠입니다. 아카이빙했던 식당들 중 학우들의 투표로 ‘진짜 서강대
            맛집’을 선정하는 특별 이벤트로, 제1회 어워드는 1,000표 이상의
            투표 수를 기록하며 뜨거운 호응을 얻었습니다.
          </p>

          <p>
            어워드에서 수상한 가게에는 서강리본 어워드 한정 스티커를 제작 및
            전달함으로써, 서강인이 인증한 맛집임을 명확히 드러내고 지역
            상권과의 상생을 실천하고 있습니다.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="flex justify-center mt-4">
        <Link
          href="/award"
          className="inline-flex items-center justify-center h-8 px-6 rounded-full bg-[#D6336C] text-white text-[13px] font-black"
        >
          서강리본어워드 바로가기
        </Link>
      </div>

      {/* Collaboration Intro */}
      <section className="mt-10 bg-white border border-[#F0B6C9] rounded-[28px] px-[15px] pt-[15px] pb-[18px]">
        <h2 className="text-[22.5px] leading-8 font-bold text-[#2B1B22] mb-2">
          지역 상권과의 협업
        </h2>

        <p className="text-[13.1px] leading-5 text-[#765260] text-justify">
          서강리본은 정기 아카이빙에 안주하지 않고, 학우들과 지역 상권
          모두에게 도움이 되는 프로젝트를 기획하며 명실상부한 서강대 대표
          맛집 브랜드로 성장하고 있습니다.
        </p>
      </section>

      {/* Collaboration Cards */}
      <section className="mt-6 space-y-6">
        {collaborationItems.map((item) => (
          <CollaborationCard
            key={item.placeName}
            title={item.title}
            body={item.body}
            place={collaborationPlaceByName.get(item.placeName)}
          />
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-8">
        <div className="bg-white border border-[#F0B6C9] rounded-[28px] px-5 py-4">
          <p className="text-[13.1px] leading-5 text-[#765260]">
            서강리본은 앞으로도 다채로운 콘텐츠와 더욱 신선한 기획으로
            서강인 여러분을 찾아가겠습니다.
          </p>
        </div>

        <div className="mt-6 pb-10">
          <h4 className="text-sm font-semibold mb-2">CONTACT</h4>

          <div className="text-[13px] text-[#2B1B22] leading-6">
            <p>Instagram : @sogang_ribbon</p>
            <p>E-mail : sogangribbon@gmail.com</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
