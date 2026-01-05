import { theme } from '@/src/styles/theme';

// K-컬처 뉴스 상세의 HTML 콘텐츠가 불완전한 경우, 완전한 HTML 문서로 감싸주는 유틸 함수
export const makeCompleteHtml = (title: string, htmlContent: string) => {
  if (!htmlContent) return '';

  const isCompleteHtml = /<html/i.test(htmlContent) || /<!DOCTYPE/i.test(htmlContent);

  if (isCompleteHtml) {
    return htmlContent;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 16px;
          color: ${theme.colors.primary.white};
          background-color: ${theme.colors.primary.black};
        }
        a {
          color: ${theme.colors.primary.mint};
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        img, video, iframe {
          max-width: 100%; !important;
          height: auto; !important;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
};
