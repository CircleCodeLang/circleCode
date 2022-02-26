let languages = {
    selected: "EN",
    get(from) {
        if (this[this.selected][from]) {
            return this[this.selected][from];
        } else if (this["EN"][from]) {
            return this["EN"][from]
        }
        return from
    },
    EN: {}

}