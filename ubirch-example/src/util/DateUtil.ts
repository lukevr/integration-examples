

export class DateUtil {

    public static utcNow(): number {
        return new Date().getTime();
    }

    public static plusDays(from:Date, days: number): Date {
        const startTime = this.utcNow();
        return new Date(startTime + days*24*60*60*1000);
    }

}