import type { LoaderOptions } from "react-kakao-maps-sdk";

// 지도와 주소 검색이 같은 SDK 인스턴스를 사용하도록 옵션을 공유한다.
export const kakaoLoaderOptions: LoaderOptions = {
  appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "",
  libraries: ["services"],
};
