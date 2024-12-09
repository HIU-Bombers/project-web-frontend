import { html } from "lit-html"
import { renderComponent } from "../util";

const Header = html`
  <section class="bg-white border-b-blue-900 border-b-4">
    <div class="container mx-auto flex justify-between items-center py-2 px-6">
      <div class="flex flex-row space-x-2">
        <img src="/assets/imgs/logo.png" alt="logo" class="h-auto w-12">
        <div class="text-2xl font-bold">
          <a href="#" class="text-sm text-gray-800">HIU Web食券販売</a>
        </div>
      </div>
    </div>
  </section>
`;

const Footer = html`
  <section class="bg-slate-800 shadow-inner">
    <div class="container mx-auto py-6 px-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-lg font-bold text-gray-600">
          <a href="#" class="hover:text-gray-500">北海道情報大学 Web食券販売</a>
        </div>
        <nav class="mt-4 md:mt-0 flex space-x-4 text-gray-600">
          <a href="#" class="hover:text-gray-500">プライバシー</a>
          <a href="#" class="hover:text-gray-500">利用規約</a>
          <a href="#" class="hover:text-gray-500">お問い合わせ</a>
        </nav>
      </div>
      <div class="text-center text-sm text-gray-500 mt-6">
        &copy; 2024 HIU Bombers. All Rights Reserved.
      </div>
    </div>
  </section>
`;

export const registerCommonComponents = () => {
  renderComponent(Header, 'header');
  renderComponent(Footer, 'footer');
};
