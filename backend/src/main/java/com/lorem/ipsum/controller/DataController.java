package com.lorem.ipsum.controller;

import com.lorem.ipsum.exception.RecordNotFoundException;
import com.lorem.ipsum.model.Data;
import com.lorem.ipsum.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import javax.validation.Valid;
import java.util.List;
@CrossOrigin
@RestController
public class DataController {

    @Autowired
    DataRepository dataRepository;

    // Get All records
    @GetMapping("/data")
    public List<Data> getAll() {
        return dataRepository.findAll();
    }

    // Create a new record
    @PostMapping("/data")
    public Data create(@Valid @RequestBody Data data) {
          return dataRepository.save(data);
    }

    // Get a single record
    @GetMapping("/data/{id}")
    public Data getById(@PathVariable(value = "id") Long id) throws RecordNotFoundException {
        return dataRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));
    }

    // Update a record
    @PutMapping("/data/{id}")
    public Data update(@PathVariable(value = "id") Long id, @Valid @RequestBody Data data) throws RecordNotFoundException {

        Data newData = dataRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        newData.setName(data.getName());
        newData.setNumber(data.getNumber());
        newData.setCity(data.getCity());
        newData.setCountry(data.getCountry());
        newData.setCompany(data.getCompany());

        Data updatedData = dataRepository.save(newData);

        return updatedData;
    }

    // Delete a Note
    @DeleteMapping("/data/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id") Long id) throws RecordNotFoundException {
        Data data = dataRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        dataRepository.delete(data);

        return ResponseEntity.ok().build();
    }
}