create database breachApp;

create table breaches (
    breach_id varchar(255) primary key,
    user_email varchar(255),
    company_name varchar(255),
    position varchar(255),
    year_applied int,
    doc_id varchar(255),
    breach_added_date date 
);

create table documents (
    doc_id varchar(255) primary key,
    user_email varchar(255),
    school_name varchar(255),
    gpa double precision,
    major varchar(30),
    minor varchar(30),
    grad_date date,
    previous_experiences varchar(1000),
    skills varchar(255),
    clubs_activities varchar(1000),
    awards_honors varchar(255),
    ethnicity varchar(255),
    gender varchar(255),
    doc_added_date date
);

create table users (
    email varchar(255) primary key,
    hashed_password varchar(255)
);