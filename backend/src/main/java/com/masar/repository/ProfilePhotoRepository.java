package com.masar.repository;

import com.masar.model.ProfilePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilePhotoRepository extends JpaRepository<ProfilePhoto, Long> {
}
