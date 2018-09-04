--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.10
-- Dumped by pg_dump version 10.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_with_oids = false;

--
-- Name: discord_pair_code; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discord_pair_code (
    id_pair_code integer NOT NULL,
    pair_code character varying(50),
    moodle_login character varying(100),
    moodle_firstname character varying(50),
    moodle_lastname character varying(50)
);


--
-- Name: discord_pair_code_id_pair_code_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discord_pair_code_id_pair_code_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discord_pair_code_id_pair_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discord_pair_code_id_pair_code_seq OWNED BY public.discord_pair_code.id_pair_code;


--
-- Name: discord_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discord_user (
    id_discord_user integer NOT NULL,
    moodle_login character varying(100),
    moodle_firstname character varying(50),
    moodle_lastname character varying(50),
    discord_id character varying(100)
);


--
-- Name: discord_user_id_discord_user_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discord_user_id_discord_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discord_user_id_discord_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discord_user_id_discord_user_seq OWNED BY public.discord_user.id_discord_user;


--
-- Name: group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."group" (
    id_group integer NOT NULL,
    group_name character varying(50)
);


--
-- Name: group_id_group_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_id_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_id_group_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_id_group_seq OWNED BY public."group".id_group;


--
-- Name: homework; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homework (
    id_homework integer NOT NULL,
    date date,
    course character varying(200) NOT NULL,
    content character varying(300) NOT NULL,
    author_discord_id character varying(50) NOT NULL,
    group_name character varying(200) NOT NULL
);


--
-- Name: homework_id_homework_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homework_id_homework_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: homework_id_homework_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homework_id_homework_seq OWNED BY public.homework.id_homework;


--
-- Name: maison; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maison (
    id_maison integer NOT NULL,
    maison_name character varying(30)
);


--
-- Name: maison_id_maison_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maison_id_maison_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maison_id_maison_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maison_id_maison_seq OWNED BY public.maison.id_maison;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    id_notif integer NOT NULL,
    notif_name character varying(100)
);


--
-- Name: notification_id_notif_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_id_notif_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_id_notif_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_id_notif_seq OWNED BY public.notification.id_notif;


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    id_role integer NOT NULL,
    role_name character varying(50) NOT NULL
);


--
-- Name: role_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_group (
    id_role integer NOT NULL,
    id_group integer NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.role.id_role;


--
-- Name: discord_pair_code id_pair_code; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord_pair_code ALTER COLUMN id_pair_code SET DEFAULT nextval('public.discord_pair_code_id_pair_code_seq'::regclass);


--
-- Name: discord_user id_discord_user; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord_user ALTER COLUMN id_discord_user SET DEFAULT nextval('public.discord_user_id_discord_user_seq'::regclass);


--
-- Name: group id_group; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."group" ALTER COLUMN id_group SET DEFAULT nextval('public.group_id_group_seq'::regclass);


--
-- Name: homework id_homework; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework ALTER COLUMN id_homework SET DEFAULT nextval('public.homework_id_homework_seq'::regclass);


--
-- Name: maison id_maison; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maison ALTER COLUMN id_maison SET DEFAULT nextval('public.maison_id_maison_seq'::regclass);


--
-- Name: notification id_notif; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification ALTER COLUMN id_notif SET DEFAULT nextval('public.notification_id_notif_seq'::regclass);


--
-- Name: role id_role; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role ALTER COLUMN id_role SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Data for Name: discord_pair_code; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discord_pair_code (id_pair_code, pair_code, moodle_login, moodle_firstname, moodle_lastname) FROM stdin;
\.


--
-- Data for Name: discord_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discord_user (id_discord_user, moodle_login, moodle_firstname, moodle_lastname, discord_id) FROM stdin;
\.


--
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."group" (id_group, group_name) FROM stdin;
1	tp1a
2	tp1b
3	tp1c
4	tp1d
5	tp1e
6	tp2a
7	tp2b
8	tp2c
11	invité
\.


--
-- Data for Name: homework; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.homework (id_homework, date, course, content, author_discord_id, group_name) FROM stdin;
15	2018-12-27	Java	TP Breakout	411139773940629514	tp1a
16	2018-12-27	Java	TP Breakout	411139773940629514	tp1a
17	2018-12-27	Java	TP Breakout	411139773940629514	tp1a
18	2018-12-28	Java	TP Breakout	411139773940629514	tp1a
19	2018-12-24	Java	TP Breakout	411139773940629514	tp1a
20	2018-08-10	Java	test	411139773940629514	tp1a
21	2018-12-27	Java	TP Breakout	411139773940629514	tp1a
22	2018-12-25	Java	TP Breakout	411139773940629514	tp1a
23	2018-12-26	Java	TP Breakout	411139773940629514	tp1a
\.


--
-- Data for Name: maison; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maison (id_maison, maison_name) FROM stdin;
1	Omega
2	Theta
3	Sigma
4	Delta
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification (id_notif, notif_name) FROM stdin;
1	esport_notif
2	echecs_notif
3	help_center_notif
4	volontaire_notif
5	sorties_notif
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role (id_role, role_name) FROM stdin;
3	TP1A
4	TP1B
5	TP1C
6	TP1D
7	TP1E
8	TP2A
9	TP2B
10	TP2C
13	Omega
14	Theta
15	Sigma
16	Delta
1	1ère année
17	2ème année APP
2	2ème année FI
18	Étudiant
19	IUT
20	Invité
\.


--
-- Data for Name: role_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_group (id_role, id_group) FROM stdin;
1	1
3	1
1	2
4	2
1	3
5	3
1	4
6	4
1	5
7	5
2	6
8	6
2	7
9	7
10	8
17	8
18	1
18	2
18	3
18	4
18	5
18	6
18	7
18	8
19	1
19	2
19	3
19	4
19	5
19	6
19	7
19	8
20	11
\.


--
-- Name: discord_pair_code_id_pair_code_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discord_pair_code_id_pair_code_seq', 1, false);


--
-- Name: discord_user_id_discord_user_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discord_user_id_discord_user_seq', 1, false);


--
-- Name: group_id_group_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.group_id_group_seq', 11, true);


--
-- Name: homework_id_homework_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.homework_id_homework_seq', 23, true);


--
-- Name: maison_id_maison_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maison_id_maison_seq', 4, true);


--
-- Name: notification_id_notif_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notification_id_notif_seq', 5, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 20, true);


--
-- Name: discord_pair_code discord_pair_code_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord_pair_code
    ADD CONSTRAINT discord_pair_code_pkey PRIMARY KEY (id_pair_code);


--
-- Name: discord_user discord_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord_user
    ADD CONSTRAINT discord_user_pkey PRIMARY KEY (id_discord_user);


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id_group);


--
-- Name: homework homework_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework
    ADD CONSTRAINT homework_pkey PRIMARY KEY (id_homework);


--
-- Name: maison maisons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maison
    ADD CONSTRAINT maisons_pkey PRIMARY KEY (id_maison);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id_notif);


--
-- Name: role_group role_group_multi_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_group
    ADD CONSTRAINT role_group_multi_pk PRIMARY KEY (id_role, id_group);


--
-- Name: role roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_role);


--
-- PostgreSQL database dump complete
--

