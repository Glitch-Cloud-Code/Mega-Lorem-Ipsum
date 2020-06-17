package com.lorem.ipsum.repository;

import com.lorem.ipsum.model.Data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DataRepository extends JpaRepository<Data, Long> {
}