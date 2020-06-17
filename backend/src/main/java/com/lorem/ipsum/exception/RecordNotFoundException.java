package com.lorem.ipsum.exception;

public class RecordNotFoundException extends Exception {
    private long id;
    public RecordNotFoundException(long id) {
        super(String.format("Record with id : '%s' is not found", id));
    }
}

