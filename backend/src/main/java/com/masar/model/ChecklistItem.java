package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "checklist_items")
@Data
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String groupName;   // French - "Before you leave" etc.

    @Column(length = 80)
    private String groupNameEn;

    @Column(length = 80)
    private String groupNameAr;

    @Column(length = 80)
    private String groupNameEs;

    @Column(nullable = false, length = 255)
    private String text;        // French

    @Column(length = 255)
    private String textEn;

    @Column(length = 255)
    private String textAr;

    @Column(length = 255)
    private String textEs;

    @Column(nullable = false)
    private Integer orderIndex;
}
