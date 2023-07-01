class Constants {

    SECOND = 1000;
    MINUTE = 60 * this.SECOND;
    HOUR = 60 * this.MINUTE;
    DAY = 24 * this.HOUR;
    MONTH = 30 * this.DAY;
    YEAR = 365 * this.DAY;

    MAX_PRECISION = 8;

}

const instance = new Constants();
module.exports = instance;