import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';
import Index from './pages/index/index';
import dva from './dva';

import './app.scss';

const store= dva._store;

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/login'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  };

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
