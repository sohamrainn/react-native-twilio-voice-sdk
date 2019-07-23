//
//  TwilioVoice.m
//

#import "RNTwilioVoice.h"
#import <React/RCTLog.h>

@import AVFoundation;
@import TwilioVoice;

@interface RNTwilioVoice () <TVOCallDelegate>

@property (nonatomic, strong) TVOCall *call;
@end

@implementation RNTwilioVoice {
}

NSString * const StateConnecting = @"CONNECTING";
NSString * const StateConnected = @"CONNECTED";
NSString * const StateDisconnected = @"DISCONNECTED";
NSString * const StateReconnecting = @"RECONNECTING";
NSString * const StateRinging = @"RINGING";

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"ringing", @"connected", @"connectFailure", @"reconnecting", @"reconnected", @"disconnected"];
}

@synthesize bridge = _bridge;

- (void)dealloc {
    if(self.call) {
        [self disconnect];
    }
}

RCT_EXPORT_METHOD(connect: (NSString *)accessToken options:(NSDictionary *)options) {
//  NSLog(@"Calling phone number %@", [params valueForKey:@"To"]);

//  [TwilioVoice setLogLevel:TVOLogLevelVerbose];

    //    TODO: Enable proximityMonitoring ?
//  UIDevice* device = [UIDevice currentDevice];
//  device.proximityMonitoringEnabled = YES;

  if (self.call) {
    [self.call disconnect];
  } else {
    NSUUID *uuid = [NSUUID UUID];
      TVOConnectOptions *connectOptions = [TVOConnectOptions optionsWithAccessToken:accessToken
                                                                              block:^(TVOConnectOptionsBuilder *builder) {
                                                                                  builder.params = options;
                                                                                  builder.uuid = uuid;
//                                                                                  builder.region = region;
//                                                                                  builder.iceOptions = ;
//                                                                                  builder.preferredAudioCodecs = ;
//                                                                                  builder.delegateQueue = ;

                                                                              }];

      self.call = [TwilioVoice connectWithOptions:connectOptions delegate:self];
    // [self performStartCallActionWithUUID:uuid handle:handle];
  }
}

RCT_EXPORT_METHOD(disconnect) {
  NSLog(@"Disconnecting call");
    [self.call disconnect];
}

RCT_EXPORT_METHOD(setMuted: (BOOL *)muted) {
  NSLog(@"Mute/UnMute call");
  self.call.muted = muted;
}

RCT_EXPORT_METHOD(setSpeakerPhone: (BOOL *)speaker) {
  [self toggleAudioRoute:speaker];
}

RCT_EXPORT_METHOD(sendDigits: (NSString *)digits){
  if (self.call && self.call.state == TVOCallStateConnected) {
    NSLog(@"SendDigits %@", digits);
    [self.call sendDigits:digits];
  }
}

RCT_REMAP_METHOD(getActiveCall,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){

  if (self.call) {
    NSMutableDictionary *params = [self callParamsFor:self.call];
    resolve(params);
  } else{
    reject(@"no_call", @"There was no active call", nil);
  }
}

- (NSString *)callStateFor:(TVOCall *)call {
    if (call.state == TVOCallStateConnected) {
        return StateConnected;
    } else if (call.state == TVOCallStateConnecting) {
        return StateConnecting;
    } else if (call.state == TVOCallStateDisconnected) {
        return StateDisconnected;
    } else if (call.state == TVOCallStateReconnecting) {
        return StateReconnecting;
    } else if (call.state == TVOCallStateRinging) {
        return StateRinging;
    }
    return @"INVALID";
}

- (NSMutableDictionary *)callParamsFor:(TVOCall *)call {
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    if (call.sid) {
        [params setObject:call.sid forKey:@"sid"];
    }
    if (call.to){
        [params setObject:call.to forKey:@"to"];
    }
    if (call.from){
        [params setObject:call.from forKey:@"from"];
    }
    [params setObject:[self callStateFor:call] forKey:@"state"];
    return params;
}

- (NSMutableDictionary *)paramsForError:(NSError *)error {
    NSMutableDictionary *params = [self callParamsFor:self.call];
    if (error) {
        NSString* errMsg = [error localizedDescription];
        if (error.localizedFailureReason) {
            errMsg = [error localizedFailureReason];
        }
        [params setObject:errMsg forKey:@"error"];
    }
    return params;
}

#pragma mark - TVOCallDelegate
//return @[@"ringing", @"connected", @"connectFailure", @"reconnecting", @"reconnected", @"disconnected"];

- (void)callDidConnect:(TVOCall *)call {
  self.call = call;

  NSMutableDictionary *callParams = [self callParamsFor:call];
  [self sendEventWithName:@"connected" body:callParams];
}

- (void)call:(TVOCall *)call didFailToConnectWithError:(NSError *)error {
  NSLog(@"Call failed to connect: %@", error);

  NSMutableDictionary *callParams = [self paramsForError:error];
  [self sendEventWithName:@"connectFailure" body:callParams];
  [self disconnect];
  self.call = nil;
}

- (void)call:(TVOCall *)call didDisconnectWithError:(NSError *)error {
  NSLog(@"Call disconnected with error: %@", error);

  NSMutableDictionary *callParams = [self paramsForError:error];
  [self sendEventWithName:@"disconnected" body:callParams];
  [self disconnect];
  self.call = nil;
}

- (void)callDidStartRinging:(TVOCall *)call {
  self.call = call;

  NSMutableDictionary *callParams = [self callParamsFor:call];
  [self sendEventWithName:@"ringing" body:callParams];
}

- (void)call:(TVOCall *)call isReconnectingWithError:(NSError *)error {
  NSLog(@"Call is reconnecting with error: %@", error);

  NSMutableDictionary *callParams = [self paramsForError:error];
  [self sendEventWithName:@"reconnecting" body:callParams];
}

- (void)callDidReconnect:(TVOCall *)call {
  self.call = call;

  NSMutableDictionary *callParams = [self callParamsFor:call];
  [self sendEventWithName:@"reconnected" body:callParams];
}

#pragma mark - AVAudioSession
- (void)toggleAudioRoute: (BOOL *)toSpeaker {
  // The mode set by the Voice SDK is "VoiceChat" so the default audio route is the built-in receiver.
  // Use port override to switch the route.
  NSError *error = nil;
  NSLog(@"toggleAudioRoute");

  if (toSpeaker) {
    if (![[AVAudioSession sharedInstance] overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker
                                                            error:&error]) {
      NSLog(@"Unable to reroute audio: %@", [error localizedDescription]);
    }
  } else {
    if (![[AVAudioSession sharedInstance] overrideOutputAudioPort:AVAudioSessionPortOverrideNone
                                                            error:&error]) {
      NSLog(@"Unable to reroute audio: %@", [error localizedDescription]);
    }
  }
}

@end
