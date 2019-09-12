package model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "task")
public class Task implements Serializable {

    private static final long serialVersionUID = -2343243243242432341L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;
    public String title;
    public String description;
    public Integer status;
    public Integer sort;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Task() {
    }

    public Task(String title, String description, Integer status, Integer sort) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.sort = sort;
    }
}