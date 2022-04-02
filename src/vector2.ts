import {Vector2Dto} from "./dto/vector2Dto";

export class Vector2 {
    constructor(public x: number, public y: number) {
    }

    public static fromDto(vector2Dto: Vector2Dto) {
        return new Vector2(vector2Dto.x, vector2Dto.y);
    }

    public times(factor :number) {
        const x = this.x * factor;
        const y = this.y * factor;

        return new Vector2(x, y);
    }

    public add(vector :Vector2) {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        
        return new Vector2(x, y);
    }
}