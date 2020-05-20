import styled from "styled-components";

export const StyledForm = styled.div`
  .form {
    /* background-color: red; */
    &__group:not(:last-child) {
      margin-bottom: 2rem;
    }

    &__input {
      font-size: 1.5rem;
      font-family: inherit;
      color: inherit;
      padding: 1.5rem 2rem;
      border-radius: 2px;
      background-color: rgba(#fff, 0.5);
      border: none;
      border-bottom: 3px solid orange;
      width: 100%;
      display: block;
      transition: all 0.3s;

      &:focus {
        outline: none;
        box-shadow: 0 1rem 2rem rgba(#000, 0.1);
        border-bottom: 3px solid #7ed56f;
      }

      &:focus:invalid {
        border-bottom: 3px solid #ff7730;
      }

      &::-webkit-input-placeholder {
        color: #999;
      }
    }

    &__label {
      font-size: 1.2rem;
      font-weight: 700;
      margin-left: 2rem;
      margin-top: 0.7rem;
      display: block;
      transition: all 0.3s;
    }

    &__input:placeholder-shown + &__label {
      opacity: 1;
      visibility: hidden;
      transform: translateY(-4rem);
    }
  }
`;
