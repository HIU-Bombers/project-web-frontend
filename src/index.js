import './styles.css';
import './user';
import { registerCommonComponents } from '../assets/js/components/common';
import { registerMenuComponents } from '../assets/js/components/menu';

if (module.hot) {
  module.hot.accept();
}

// 各コンポーネントを描画

registerCommonComponents();
registerMenuComponents();
