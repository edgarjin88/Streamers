import styled from "styled-components";

const StyledLoading = styled.div`
  font-family: consolas;
  position: fixed;
  top: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 10rem;
  width: 100%;
  background: rgba(255, 196, 0, 0.315);

  .wavy {
    margin: auto;
    position: relative;
    -webkit-box-reflect: below -12px linear-gradient(transparent, rgba(0, 0, 0, 0.2));
  }
  & span {
    position: relative;
    display: inline-block;
    color: #000;
    font-size: 4em;
    text-transform: uppercase;
    animation: animate 1s ease-in-out infinite;
    &.one {
      animation-delay: calc(0.1s * 1);
    }
    &.two {
      animation-delay: calc(0.1s * 2);
    }
    &.three {
      animation-delay: calc(0.1s * 3);
    }
    &.four {
      animation-delay: calc(0.1s * 4);
    }
    &.five {
      animation-delay: calc(0.1s * 5);
    }
    &.six {
      animation-delay: calc(0.1s * 6);
    }
    &.seven {
      animation-delay: calc(0.1s * 7);
    }
    &.eight {
      animation-delay: calc(0.1s * 8);
    }

    &.nine {
      animation-delay: calc(0.1s * 9);
    }
  }

  @keyframes animate {
    0% {
      transform: translateY(0px);
    }
    20% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0px);
    }
  }
`;
const Loading = () => {
  return (
    <StyledLoading>
      <div className="wavy">
        <span className="one">L</span>
        <span className="two">o</span>
        <span className="three">a</span>
        <span className="four">d</span>
        <span className="five">i</span>
        <span className="six">n</span>
        <span className="seven">g</span>
        <span className="eight">.</span>
        <span className="nine">.</span>
        <span className="ten">.</span>
      </div>
    </StyledLoading>
  );
};

export default Loading;
