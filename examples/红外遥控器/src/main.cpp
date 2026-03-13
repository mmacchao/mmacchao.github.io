/*
 * @Author: mazhichao mazhichao@jxcc.com
 * @Date: 2026-03-11 08:18:59
 * @LastEditors: mazhichao mazhichao@jxcc.com
 * @LastEditTime: 2026-03-12 08:13:26
 * @FilePath: \测试遥控器\src\main.cpp
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
#include <Arduino.h>
#include <IRremote.h>

// 某些构建环境下该宏不可见，这里给一个安全默认值（IRremote 默认 tick=50us）
#ifndef MICROS_PER_TICK
#define MICROS_PER_TICK 50
#endif

// 接收/发射引脚
static const uint8_t IR_RX_PIN = 11;
static const uint8_t IR_TX_PIN = 3;

// 按钮：按下后发射最近一次接收到的红外
static const uint8_t SEND_BUTTON_PIN = 2;

// 存储最近一次收到的红外（优先存“协议+地址+命令”；未知协议则存 raw）
static bool g_hasStored = false;
static decode_type_t g_protocol = UNKNOWN;
static uint16_t g_address = 0;
static uint16_t g_command = 0;
static uint8_t g_bits = 0;

static const uint16_t MAX_RAW_LEN = 200;
static uint16_t g_rawTicks[MAX_RAW_LEN];
static uint16_t g_rawLen = 0;

static bool readButtonPressedEdge()
{
  static bool lastState = HIGH;
  bool currentState = digitalRead(SEND_BUTTON_PIN);

  // 只有从 HIGH 变为 LOW 才是按下
  if (lastState == HIGH && currentState == LOW)
  {
    delay(50); // 增加消抖时间
    if (digitalRead(SEND_BUTTON_PIN) == LOW)
    {
      lastState = LOW;
      return true;
    }
  }
  lastState = currentState;
  return false;
}

static void storeLatestIR()
{
  g_protocol = IrReceiver.decodedIRData.protocol;
  g_bits = IrReceiver.decodedIRData.numberOfBits;

  if (g_protocol != UNKNOWN)
  {
    g_address = IrReceiver.decodedIRData.address;
    g_command = IrReceiver.decodedIRData.command;
    g_rawLen = 0;
    g_hasStored = true;
    Serial.print("已保存：");
    Serial.print(IrReceiver.getProtocolString());
    Serial.print(" addr=0x");
    Serial.print(g_address, HEX);
    Serial.print(" cmd=0x");
    Serial.print(g_command, HEX);
    Serial.print(" bits=");
    Serial.println(g_bits);
    return;
  }

  // 未知协议：尝试存 raw buffer（ticks）
  // IRremote v4+: rawbuf 在 IrReceiver.irparams 里，长度在 decodedIRData.rawlen
  uint16_t len = IrReceiver.decodedIRData.rawlen;
  if (len > 0)
  {
    if (len > MAX_RAW_LEN)
      len = MAX_RAW_LEN;
    g_rawLen = len;
    for (uint16_t i = 0; i < len; i++)
    {
      g_rawTicks[i] = IrReceiver.irparams.rawbuf[i];
    }
    g_hasStored = true;
    Serial.print("已保存：UNKNOWN rawlen=");
    Serial.println(g_rawLen);
    return;
  }

  Serial.println("保存失败：UNKNOWN 且无 raw 数据。");
}

static void sendStoredIR()
{
  if (!g_hasStored)
  {
    Serial.println("还没有保存任何红外信号：请先按遥控器发一次。");
    return;
  }

  Serial.println("开始发射已保存的红外信号…");
  Serial.flush(); // 避免串口中断影响软件载波 PWM

  if (g_protocol != UNKNOWN)
  {
    // 通用发送：交给 IRremote 自己按协议处理（repeats=0）
    size_t sent = IrSender.write(g_protocol, g_address, g_command, 0);
    if (!sent)
    {
      Serial.print("发射失败：该协议不支持 write(): ");
      Serial.println(IrReceiver.getProtocolString());
      return;
    }
    Serial.println("发射完成（协议模式，write）。");
    return;
  }

  if (g_rawLen > 0)
  {
    // rawbuf 为 ticks（通常每 tick=50us），sendRaw 需要 microseconds
    static uint16_t rawMicros[MAX_RAW_LEN];
    for (uint16_t i = 0; i < g_rawLen; i++)
    {
      rawMicros[i] = (uint16_t)(g_rawTicks[i] * MICROS_PER_TICK);
    }
    IrSender.sendRaw(rawMicros, g_rawLen, 38);
    Serial.println("发射完成（RAW 模式）。");
    return;
  }

  Serial.println("发射失败：没有可用的 raw 数据。");
}

void toggleIR()
{
  // 使用 static 变量保存当前状态，只在初始化时赋值一次
  static bool ledState = false;

  ledState = !ledState; // 翻转逻辑状态
  digitalWrite(IR_TX_PIN, ledState ? HIGH : LOW);
}

// 封装发送动作，确保状态切换清晰
void executeSendSequence()
{
  toggleIR();
  IrReceiver.stop();

  sendStoredIR();

  delay(100); // 给硬件留出冷却时间
  IrReceiver.start();
  // digitalWrite(LED_BUILTIN, LOW);
}

void setup()
{
  Serial.begin(9600);
  delay(500); // 等待串口稳定
  Serial.println("--- 系统启动中 ---");

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(SEND_BUTTON_PIN, INPUT_PULLUP);

  // 关键改动：先不启用 LED 反馈，防止 D13 冲突
  IrReceiver.begin(IR_RX_PIN, DISABLE_LED_FEEDBACK);
  IrSender.begin(IR_TX_PIN, DISABLE_LED_FEEDBACK);

  Serial.print("1. 红外接收器已就绪 (引脚");
  Serial.print(IR_RX_PIN);
  Serial.println(")");
  Serial.print("2. 红外发射器已就绪 (引脚");
  Serial.print(IR_TX_PIN);
  Serial.println(")");
  Serial.print("3. 发送按钮已就绪 (引脚");
  Serial.print(SEND_BUTTON_PIN);
  Serial.println("，按下发射最近一次接收的信号)");
  Serial.println("操作：先按遥控器任意键（保存），再按按钮（发射）。");
}

void loop()
{
  // 1. 监测红外
  if (IrReceiver.decode())
  {
    Serial.print("收到：");
    Serial.println(IrReceiver.getProtocolString());
    storeLatestIR();
    IrReceiver.resume();
  }

  // 2. 按钮按下逻辑：增加一个简单的标志位防止冲突
  static unsigned long lastBtnCheck = 0;
  if (millis() - lastBtnCheck > 50)
  { // 每50ms检查一次按钮，降低采样频率
    if (readButtonPressedEdge())
    {
      Serial.println(">>> 物理按钮被触发 <<<");
      // 执行发送逻辑...
      executeSendSequence();
    }
    lastBtnCheck = millis();
  }
}
