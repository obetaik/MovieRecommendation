// we need this statement to add a reference to the Reactotron debugger app
// see: https://github.com/infinitered/reactotron it acts as an inspector for React native apps
if(__DEV__) {
    import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

// the index.js file is simply used to register the app's entry point - i.e. App.js.
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
