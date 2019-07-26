# react-native-twilio-voice-sdk
This is a React Native wrapper for Twilio Programmable Voice SDK that lets you make (and in the future receive) calls from your ReactNative App. This module is not curated nor maintained, but inspired by Twilio.

The initial version of this library was forked from [react-native-twilio-programmable-voice](https://github.com/hoxfon/react-native-twilio-programmable-voice) in order to update Twilio's programmable Voice SDK libraries to their latest version. This is specially important because version 2 of Twilio's libraries used by `react-native-twilio-programmable-voice` is going to be deprecated by Jan, 1st 2020. In order to simplify the migration, only the making calls part was migrated.

# Twilio Programmable Voice SDK

- Android 4.1.0
- iOS 4.1.0

## Installation

Before starting, we recommend you get familiar with [Twilio Programmable Voice SDK](https://www.twilio.com/docs/api/voice-sdk).
It's easier to integrate this module into your react-native app if you follow the Quick start tutorial from Twilio, because it makes very clear which setup steps are required.

This library only intends to support React Native versions over 0.60. This doesn't mean that it won't work with previous versions, just that issues related to previous versions of RN won't be actively tracked by the mantainer.

```
npm install react-native-twilio-voice-sdk --save
```

## Usage

```javascript
import TwilioVoice from 'react-native-twilio-voice-sdk'

// Get the library version
TwilioVoice.getVersion()

// Get the underlying native TwilioVoice library version
// getNativeVersion() returns a promise with the version value
TwilioVoice.getNativeVersion().then(v => console.log(v));

// start a call
TwilioVoice.connect(accessToken, {to: '+61234567890'})

// hangup
TwilioVoice.disconnect()

// mute or un-mute the call
// mutedValue must be a boolean
TwilioVoice.setMuted(mutedValue)

// Send the call audio to the speaker phone
// speakerPhoneEnabled must be a boolean
TwilioVoice.setSpeakerPhone(speakerPhoneEnabled)

TwilioVoice.sendDigits(digits)

// The getActiveCall() method returns a promise which resolves
// to an object that conforms with the Call interface (see events)
TwilioVoice.getActiveCall().then((incomingCall: CallInterface) => {})
```

## Events

```javascript
// The call object interface used in the events is as follows (typescript notation):
// { 
//    sid: string, // Twilio call sid
//    state: 'RINGING' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING',
//    from?: string, // Optional from number/string set by Twilio
//    to?: string, // Optional to number/string set by Twilio
//    error?: errorInterface // Optional error message in some cases
// }
//
// The error Interface is as follows:
// {
//   message?: string, // Error message
//   code?: int, // Twilio's error code
//   domain?: string, // Error domain (only on iOS)
//   reason?: string, // Underlying reason provided by Twilio
// }

TwilioVoice.addEventListener('ringing', function(call: callInterface) {});
TwilioVoice.addEventListener('connected', function(call: callInterface) {});
TwilioVoice.addEventListener('connectFailure', function(call: callInterfaceWithError) {});
TwilioVoice.addEventListener('reconnecting', function(call: callInterfaceWithError) {});
TwilioVoice.addEventListener('reconnected', function(call: callInterface) {});
TwilioVoice.addEventListener('disconnected', function(call: callInterface) {});



```

## Twilio Voice SDK reference

[iOS changelog](https://www.twilio.com/docs/api/voice-sdk/ios/changelog)

[Android changelog](https://www.twilio.com/docs/api/voice-sdk/android/changelog)

## Credits

[react-native-twilio-programmable-voice](https://github.com/hoxfon/react-native-twilio-programmable-voice)

[voice-quickstart-android](https://github.com/twilio/voice-quickstart-android)

[react-native-push-notification](https://github.com/zo0r/react-native-push-notification)

[voice-quickstart-objc](https://github.com/twilio/voice-quickstart-objc)


## License

MIT
