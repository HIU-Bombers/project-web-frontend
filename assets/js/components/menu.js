import { html } from "lit-html"
import { renderComponent } from "../util";

const MenuBar = html`
  <div class="w-full h-20 border-t-2 border-gray-300 p-2">
      <ul class="flex flex-row justify-around">
      <li>
        <a href="#">
          <img src="/assets/imgs/menu/home.png" class="w-10 h-auto">
        </a>
      </li>
      <li>
        <a href="#">
          <img src="/assets/imgs/menu/food.png" class="w-10 h-auto">
        </a>
      </li>
      <li>
        <a href="#">
          <img src="/assets/imgs/menu/qr.png" class="w-10 h-auto">
        </a>
      </li>
    </ul>
  </div>
`;

export const registerMenuComponents = () => {
  renderComponent(MenuBar, 'menu');
};
