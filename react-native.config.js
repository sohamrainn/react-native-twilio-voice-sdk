module.exports = {
  // config for a library is scoped under "dependency" key
  dependency: {
    platforms: {
      ios: {},
      android: {
        packageInstance: "new TwilioVoiceSDKPackage()"
      }, // projects are grouped into "platforms"
    },
    // assets: ['./path-to-assets'], // stays the same
    // hooks are considered anti-pattern, please avoid them
    // hooks: {
    //   prelink: './path-to-a-prelink-hook',
    // },
  },
};