export class Configuration {
  dumpMode: boolean;
  privacyMode: boolean;
  brokerAddress: string;
  brokerPort: number;
  lwtTopic: string;
  lwtMessage: string;
  topic: string;
  powerThrashold: number;

  constructor(dumpMode: boolean, privacyMode: boolean, brokerAddress: string, brokerPort: number, lwtTopic: string, lwtMessage: string, topic: string, powerThrashold: number) {
    this.dumpMode = dumpMode;
    this.privacyMode = privacyMode;
    this.brokerAddress = brokerAddress;
    this.brokerPort = brokerPort;
    this.lwtTopic = lwtTopic;
    this.lwtMessage = lwtMessage;
    this.topic = topic;
    this.powerThrashold = powerThrashold;
  }
}
