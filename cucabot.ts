/* 
* Cucabot drivers
*/
enum mCommands
{
    MR_FOR = 0x01,
    MR_REV = 0x02,
    MR_STOP = 0x03,

    ML_FOR = 0x04,
    ML_REV = 0x05,
    ML_STOP = 0x06,

    MOVE_FORWARD = 0x07,
    MOVE_REVERSE = 0x08,
    BRAKE = 0x09,

    READ_ENC_R = 0x10,
    READ_ENC_L = 0x11,
    READ_EPOCH = 0x12,
    RESET_COUNTERS = 0x13,
    READ_DRIVER_VERSION = 0x14,
}

/**
  * Enumeration of forward/reverse directions
  */
enum mDirection {
    //% block="forward"
    Forward,
    //% block="reverse"
    Reverse
}
/**
  * Enumeration of motors.
  */
enum mMotor {
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="both"
    Both
}

/**
  * Enumeration of motors.
  */
enum mEncoder {
    //% block="left"
    Left,
    //% block="right"
    Right,
}

// Default Slave ID address
let slaveId = 0x04

//% weight=50 color=#f54242 icon="\uf188"
namespace cucabot {
    /**
     * this function starts the left motor
     * @param speed speed of the motor
     */
    //% blockId="move" block="move %motor motor %direction at %speed"
    //% speed.min=20 speed.max=240
    //% subcategory=Motors
    export function move(motor: mMotor, direction: mDirection, speed: number): void {
        // Add code here
        let buf = pins.createBuffer(2);
        if (direction == mDirection.Forward && motor == mMotor.Left) {
            buf[0] = mCommands.ML_FOR
        } else if (direction == mDirection.Reverse && motor == mMotor.Left) {
            buf[0] = mCommands.ML_REV
        } else if (direction == mDirection.Forward && motor == mMotor.Both) {
            buf[0] = mCommands.MOVE_FORWARD
        } else if (direction == mDirection.Reverse && motor == mMotor.Both) {
            buf[0] = mCommands.MOVE_REVERSE
        }
        buf[1] = speed
        pins.i2cWriteBuffer(slaveId, buf);
    }

    /**
     * this function stops the left motor
     * @param speed speed of the motor
     */
    //% blockId="stop" block="stop %motor"
    //% subcategory=Motors
    export function stop(motor: mMotor): void {
        let buf = pins.createBuffer(2);
        if (motor == mMotor.Left) {
            buf[0] = mCommands.ML_STOP
        } else if (motor == mMotor.Right) {
            buf[0] = mCommands.MR_STOP
        } else if (motor == mMotor.Both) {
            buf[0] = mCommands.BRAKE
        }
        buf[1] = 0
        pins.i2cWriteBuffer(slaveId, buf);
    }


    /**
     * this function brakes the robot
     */
    //% blockId="brake" block="brake"
    //% subcategory=Motors
    export function brake(): void {
        let buf = pins.createBuffer(2);
        buf[0] = mCommands.BRAKE
        buf[1] = 0
        pins.i2cWriteBuffer(slaveId, buf);
    }

    /**
     * this function reads the encoders
     * @param motor motor
     */
    //% blockId="readCounter" block="read %motor encoder"
    //% subcategory=Motors
    export function read_counter(encoder: mEncoder): int16 {
        let buf = pins.createBuffer(2);
        if(encoder == mEncoder.Right){
            buf[0] = mCommands.READ_ENC_R //Read R
        } else if (encoder == mEncoder.Left){
            buf[0] = mCommands.READ_ENC_L //Read R
        }
        buf[1] = 0
        pins.i2cWriteBuffer(slaveId, buf);
        let num = pins.i2cReadNumber(slaveId, NumberFormat.Int16LE)
        return num
    }


    /**
     * this function reads the seconds since the robot started
     * @param speed speed of the motor
     */
    //% blockId="readEpoch" block="running time"
    export function read_epoch(): int16 {
        let buf = pins.createBuffer(2);
        buf[0] = mCommands.READ_EPOCH
        buf[1] = 0
        pins.i2cWriteBuffer(slaveId, buf);
        let num = pins.i2cReadNumber(slaveId, NumberFormat.Int16LE)
        //serial.writeValue("epoch", num)
        return num
    }

    /**
     * this function resets the counters
     */
    //% blockId="resetCounters" block="reset encoders"
    //% subcategory=Motors
    export function reset_counters(): void {
        let buf = pins.createBuffer(2);
        buf[0] = mCommands.RESET_COUNTERS
        buf[1] = 0
        pins.i2cWriteBuffer(slaveId, buf);
    }
}