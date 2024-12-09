import './styles.css';
import { render } from 'lit-html';
import { Footer, Header } from '../assets/js/components/common';

if (module.hot) {
  module.hot.accept();
}

function renderComponent(compoent, domId) {
  const el = document.getElementById(domId);
  
  if (null === el) {
    return;
  }

  render(compoent, el);
}

// 各コンポーネントを描画
renderComponent(Header(), 'header');
renderComponent(Footer(), 'footer');
