import styled from "styled-components";
import { Icon } from "antd";
//styled component의 문법에 주의 하자.
// sc-ASDkd2 같은 클래스로 바꿔서 클라스 중복을 피해 준다. sc는 스타일드 컴포넌츠
// 스타일드 컴퍼넌트도 서버사이드 렌더링을 해유만 한다.
// a(), a`` 같은함수이다.
export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Sticky = styled.div`
  position:fixed;
  width:100%;
  left:0;
  top:0;
  right: 0;
  z-index: 1000;
}`;

export const Header = styled.header`
  height: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;

  & h1 {
    margin: 0;
    font-size: 17px;
    color: #333;
    line-height: 44px;
  }
`; // 이경우 header 안에 들어있는 h1이라는 뜻

export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

// 아래의 문법으로 컴퍼넌트를 덮어 씌울 수도 있다.
export const CloseBtn = styled(Icon)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
`;

export const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

export const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;
