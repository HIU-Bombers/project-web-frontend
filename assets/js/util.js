const { render } = require("lit-html");

/**
 * コンポーネントをレンダリングする
 * 
 * @param {import("lit-html").TemplateResult} compoent 
 * @param {string} domId 
 * @returns 
 */
export function renderComponent(compoent, domId) {
  const el = document.getElementById(domId);
  
  if (null === el) {
    return;
  }

  render(compoent, el);
}
