import { html } from "lit-html"
import { renderComponent } from "../util";

const Header = html`
  <section class="bg-white border-b-blue-900 border-b-4">
    <div class="container mx-auto flex justify-between items-center py-2 px-1">
      <div class="flex flex-row space-x-2 justify-start">
        <img src="/assets/imgs/logo.png" alt="logo" class="h-auto w-12">
        <div class="text-2xl font-bold">
          <a href="#" class="text-sm text-gray-800">HIU Web食券販売</a>
        </div>
      </div>
      <div id="account"></div>
    </div>
  </section>
`;

const Footer = html`
  <section class="bg-slate-800 shadow-inner">
    <div class="container mx-auto py-6 pzx-6">
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

const Account = html`
  <section>
    <details class="relative inline-block text-left">
      <summary class="cursor-pointer inline-flex items-center focus:outline-none">
        <img src="/assets/imgs/account.png" class="w-6 h-auto mt-2" alt="Account">
      </summary>

      <button type="button" @click=${logout} class="z-10 flex flex-row origin-top-right absolute right-0 mt-2 mx-auto w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hover:bg-gray-100">
        <p class="z-10 x-block w-fit text-left mx-2 py-2 font-extrabold rounded-md text-gray-600">
          ログアウト
        </p>
        <img src="/assets/imgs/logout.png" class="h-6 w-auto my-auto" alt="Logout">
      </button>
    </details>
  </section>
`;

async function logout() {
  const res = await fetch("http://localhost:3000/logout",{
    method: "POST",
    credentials: "include"
  });

  if (200 !== res.status) {
    return;
  }

  window.location = '/login';
}


export const registerCommonComponents = async () => {
  renderComponent(Header, 'header');
  renderComponent(Footer, 'footer');

  const sessioncheckRes = await fetch("http://localhost:3000/sessioncheck",{
    method: "POST",
    credentials: "include"
  });

  const sessioncheckResJson = await sessioncheckRes.json();
  
  if (sessioncheckResJson.isLoggedIn) {
    // Cookieがある場合はアカウントコンポーネントを表示    
    renderComponent(Account, 'account');
  }
};
