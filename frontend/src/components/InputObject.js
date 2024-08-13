export class InputObject {
    type = "text"
    constructor (name, value, validator = x => ""){
        this.name = name;
        this.value = value;
        this.validator = validator;
    }
    validate(value = null){
        if (!value) value = this.value;
        return this.validator(value) ?? "";
    }
    copy(){
        return new InputObject(this.name, this.value, this.validator);
    }
}


export class RadioInputObject extends InputObject {
    type = "radio"
    constructor(name, options, validator = x => "", value=""){
        super(name, value, validator);
        this.options = [...options];
    }
    copy(){
        return new RadioInputObject(this.name, this.options, this.validator, this.value);
    }
}

export class FileInputObject extends InputObject {
    type = "file"
    constructor(name, value, accept = '*', validator = x => ""){
        super(name, value, validator);
        this.accept = accept;
    }
    copy(){
        return new FileInputObject(this.name, this.value, this.accept, this.validator);
    }
}
