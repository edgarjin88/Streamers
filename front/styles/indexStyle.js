import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

export const IndexGlobalStyle = createGlobalStyle`
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}

html,
.container {
  height: 100%;
}

html {
  font-size: 10px;
  font-family: Roboto, Arial, Helvetica, sans-serif;
}

h1 {
  font-size: 1.5rem;
  font-weight: normal;
}

h2 {
  font-size: 1.8rem;
  line-height: 2.25rem;
  margin-bottom: 3px;
  font-weight: normal;
}

h3,
h4 {
  font-size: 1.4rem;
  line-height: 1.75rem;
  margin-bottom: 3px;
}

a {
  text-decoration: none;
  color: #111;
}

.container {

  display: grid;
  grid: 48px 1fr / 1fr;
}


.container > header {
  display: grid;
  grid: 1fr / 32px 1fr 28px 28px;
  grid-column-gap: 12px;
  align-items: center;
  padding: 0 8px;
  background: #1a599c;
  color: #fff;
}

.container > header > a {
  width: 32px;
  height: 32px;
}

#search-videos-icon,
#settings-icon {
  padding-left: 4px;
  width: 28px;
}

main {
  display: grid;
  grid:
    "related-videos" max-content
    / 1fr;
}


#video-details {
  grid-area: video-details;
  padding-top: 12px;
}

#video-details > header,
#video-details > div,
#related-videos,
#video-comments {
  padding-left: 12px;
  padding-right: 12px;
}

#video-views-count {
  font-size: 1.2rem;
  color: rgba(17, 17, 17, 0.6);
}

#social-container {
  display: grid;
  grid: 1fr / repeat(5, 1fr);
  padding: 12px 0;
}

.social-item {
  display: grid;
  justify-items: center;
  grid-row-gap: 7px;
  color: rgba(17, 17, 17, 0.6);
}

.social-item.active {
  color: #1a599c;
}

.social-item > img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.social-item > p {
  font-size: 1.2rem;
}

.navigation {
    &__checkbox {
        display: none;
    }

    &__button {
        background-color: white;
        height: 7rem;
        width: 7rem;
        position: fixed;
        top: 6rem;
        right: 6rem;
        border-radius: 50%;
        z-index: 2000;
        box-shadow: 0 1rem 3rem rgba($color-black, .1);
        text-align: center;
        cursor: pointer;
    }

    &__background {
        height: 6rem;
        width: 6rem;
        border-radius: 50%;
        position: fixed;
        top: 6.5rem;
        right: 6.5rem;
        background-image: radial-gradient($color-primary-light, $color-primary-dark);
        z-index: 1000;
        transition: transform .8s cubic-bezier(0.86, 0, 0.07, 1);

        //transform: scale(80);
    }

    &__nav {
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1500;

        opacity: 0;
        width: 0;
        transition: all .8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    &__list {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        list-style: none;
        text-align: center;
        width: 100%;
    }

    &__item {
        margin: 1rem;
    }

    &__link {
        &:link,
        &:visited {
            display: inline-block;
            font-size: 3rem;
            font-weight: 300;
            padding: 1rem 2rem;
            color: $color-white;
            text-decoration: none;
            text-transform: uppercase;
            background-image: linear-gradient(120deg, transparent 0%, transparent 50%, $color-white 50%);
            background-size: 220%;
            transition: all .4s;

            span {
                margin-right: 1.5rem;
                display: inline-block;
            }
        }
        
        &:hover,
        &:active {
            background-position: 100%;
            color: $color-primary;
            transform: translateX(1rem);
        }
    }


    //FUNCTIONALITY
    &__checkbox:checked ~ &__background {
        transform: scale(80);
    }

    &__checkbox:checked ~ &__nav {
        opacity: 1;
        width: 100%;
    }


    //ICON
    &__icon {
        position: relative;
        margin-top: 3.5rem;

        &,
        &::before,
        &::after {
            width: 3rem;
            height: 2px;
            background-color: $color-grey-dark-3;
            display: inline-block;
        }

        &::before,
        &::after {
            content: "";
            position: absolute;
            left: 0;
            transition: all .2s;
        }

        &::before { top: -.8rem; }
        &::after { top: .8rem; }
    }

    &__button:hover &__icon::before {
        top: -1rem;
    }

    &__button:hover &__icon::after {
        top: 1rem;
    }

    &__checkbox:checked + &__button &__icon {
        background-color: transparent;
    }

    &__checkbox:checked + &__button &__icon::before {
        top: 0;
        transform: rotate(135deg);
    }

    &__checkbox:checked + &__button &__icon::after {
        top: 0;
        transform: rotate(-135deg);
    }
}

#channel-details {
  display: grid;
  grid: 1fr / 1fr 114px;
  grid-column-gap: 8px;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid rgba(136, 136, 136, 0.4);
  border-bottom: 1px solid rgba(136, 136, 136, 0.4);
}

#channel-details > a {
  display: grid;
  grid: 1fr / 34px 1fr;
  grid-column-gap: 12px;
  align-items: center;
}

#channel-details img {
  width: 34px;
  height: 34px;
}

#channel-subscriber-count {
  color: rgba(17, 17, 17, 0.6);
  font-size: 1.2rem;
}

#channel-details button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 8px;
  outline: none;
  border: none;
  background: transparent;
  font-size: 1.4rem;
  color: #1a599c;
  text-transform: uppercase;
  outline: none;
}

#channel-details button > img {
  height: 16px;
}

#related-videos {
  grid-area: related-videos;
}

#related-videos > header {
  display: grid;
  grid: 1fr / 1fr repeat(2, max-content);
  grid-column-gap: 8px;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 1.4rem;
}

#related-videos > header button {
  width: 37px;
  height: 14px;
  border: 0;
  outline: none;
  background: transparent;
  position: relative;
}

.autoplay-slider {
  display: block;
  width: 37px;
  height: 14px;
  border: 7px solid rgba(26, 89, 156, 0.38);
  border-radius: 7px;
}

.autoplay-slider-toggle-button {
  display: block;
  width: 20px;
  height: 20px;
  position: absolute;
  top: -3px;
  border-radius: 100%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

#related-videos {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(136, 136, 136, 0.4);
}

#related-videos > ul > li {
  margin-bottom: 12px;
  list-style: none;
}

#related-videos > ul > li:last-of-type {
  margin-bottom: 0;
}

#related-videos > ul > li article {
  display: grid;
  grid: repeat(2, max-content) 1fr / 160px 1fr;
  grid-column-gap: 8px;
  min-height: 90px;
  max-height: 90px;
  overflow-y: hidden;
}

#related-videos > ul > li img {
  grid-row: span 3;
  height: 100%;
  width: 100%;
  object-fit: cover
}

#related-videos > ul > li h4 {
  max-height: 3.75em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

#related-videos > ul > li p {
  font-size: 1.2rem;
  color: rgba(17, 17, 17, 0.6);
}

#video-comments {
  grid-area: video-comments;
  padding-top: 12px;
  padding-bottom: 12px;
}

#video-comments > header {
  display: grid;
  grid: 1fr / 1fr 24px;
}

#video-comments h2 {
  font-weight: bold;
}



#comment-form {
  display: grid;
  grid: 1fr / 48px 1fr;
  grid-column-gap: 8px;
  margin-top: 16px;
  padding: 12px;
  border-bottom: 1px solid rgba(136, 136, 136, 0.4);
}

#comment-form img,
.comment img {
  width: 48px;
  height: 48px;
  border-radius: 100%;
}

#comment-form textarea {
  padding: 6px;
  outline: none;
  color: #111;
  font-size: 1.4rem;
  resize: vertical;
  border: 1px solid rgba(135, 135, 135, 0.4);
}

#comment-form textarea::placeholder {
  color: rgba(135, 135, 135, 0.4);
}

.comment {
  display: grid;
  grid: repeat(3, max-content) / 48px 1fr;
  grid-column-gap: 8px;
  padding: 12px;
  font-size: 1.1rem;
  color: rgba(17, 17, 17, 0.6);
  border-bottom: 1px solid rgba(135, 135, 135, 0.4);
}

.comment:last-of-type {
  border-bottom: none;
}

.comment > img {
  grid-row: span 3;
}

.comment > a {
  font-size: 1.4rem;
  color: #1a599c;
}

.my-comment > a > span {
  background: #1a599c;
  color: #fff;
  border-radius: 8px;
  padding: 1px 6px;
  display: inline-block;
}

.comment > p {
  color: #000;
  font-size: 1.3rem;
  margin: 4px 0;
}

.comment-statistics {
  display: grid;
  grid: 1fr / repeat(5, max-content);
  grid-column-gap: 4px;
}

.comment-status-separator {
  font-size: 2rem;
  line-height: 1.1rem;
}

.comment-statistics > img {
  margin-left: 8px;
  width: 11px;
  height: 10px;
}

.see-response-container,
.response-list {
  grid-column: 2;
}

.see-response-container {
  display: grid;
  justify-content: center;
}

.see-response-container > button {
  background: transparent;
  border: none;
  text-transform: uppercase;
  outline: none;
  font-size: 1.4rem;
  color: #1a599c;
  cursor: pointer;
  padding: 10px 8px;
}

.response-list {
  margin-top: 15px;
}

.response {
  grid-template-columns: 26px 1fr;
  margin-bottom: 15px;
  padding: 0;
  border-bottom: 0;
}

.response > img {
  width: 26px;
  height: 26px;
}

@media (min-width: 550px) {
  main {
    grid-template-areas:
      "related-videos";
  }

  #related-videos {
    border-bottom: 0;
  }

  #related-videos > ul {
    display: grid;
    grid: auto-flow max-content / repeat(2, 1fr);
    grid-gap: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }

  #related-videos > ul > li {
    margin-bottom: 0;
  }

  #related-videos > ul > li article {
    display: block;
    min-height: inherit;
    max-height: inherit;
  }

  #related-videos > ul > li img {
    height: 26.6vw;
    min-height: 141px;
    max-height: 202px;
    object-fit: cover
  }

  .related-video-details h4 {
    padding-top: 4px;
  }

  #video-comments {
    border-bottom: 1px solid rgba(136, 136, 136, 0.4);
  }
}

@media (min-width: 768px) {
  #related-videos > ul {

    grid: auto-flow max-content / repeat(auto-fill, minmax(250px, 1fr));
  }


  #related-videos > ul > li img {
 
    object-fit: cover;
  width: 100%;
  
  }
}

@media (min-width: 800px) and (orientation: landscape) {

    main {
    grid:
      "related-videos related-videos related-videos"
      /1fr;
  }

    #related-videos > ul {
    grid: auto-flow max-content / repeat(auto-fill, minmax(250px, 1fr));
  }

  @media (min-width: 1280px) and (orientation: landscape) {

     #related-videos > ul {
       max-width: 1280px;
       margin: auto;
  }

  }




}

`;
