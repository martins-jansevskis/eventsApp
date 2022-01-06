import * as React from 'react';
import { WebView } from 'react-native-webview';


export default function WebViewScreen({route, navigation}) {
    const { uri } = route.params;

    return (
        <WebView
            originWhitelist={['*']}
            source={{ uri: uri }}
      />
    );
}
