--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Debian 15.10-1.pgdg120+1)
-- Dumped by pg_dump version 15.10 (Debian 15.10-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: estoque; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.estoque (
    codigo integer NOT NULL,
    descricao character varying(255) NOT NULL,
    fornecedor character varying(255) NOT NULL,
    data_entrada date NOT NULL,
    quantidade_entrada integer NOT NULL,
    custo numeric(10,2) NOT NULL,
    data_saida date,
    quantidade_saida integer,
    margem numeric(5,2),
    valor_venda numeric(10,2),
    saldo integer DEFAULT 0 NOT NULL,
    estoque_minimo integer DEFAULT 0 NOT NULL,
    criado_por character varying(255),
    alterado_por character varying(255),
    data_criacao timestamp without time zone DEFAULT now(),
    data_alteracao timestamp without time zone
);


ALTER TABLE public.estoque OWNER TO admin;

--
-- Name: estoque_codigo_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.estoque_codigo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estoque_codigo_seq OWNER TO admin;

--
-- Name: estoque_codigo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.estoque_codigo_seq OWNED BY public.estoque.codigo;


--
-- Name: product_entries; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.product_entries (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    product_id bigint,
    entry_date timestamp without time zone DEFAULT now(),
    cost numeric(10,2) DEFAULT 0.00 NOT NULL
);


ALTER TABLE public.product_entries OWNER TO admin;

--
-- Name: product_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.product_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_entries_id_seq OWNER TO admin;

--
-- Name: product_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.product_entries_id_seq OWNED BY public.product_entries.id;


--
-- Name: product_exits; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.product_exits (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    product_id bigint
);


ALTER TABLE public.product_exits OWNER TO admin;

--
-- Name: product_exits_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.product_exits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_exits_id_seq OWNER TO admin;

--
-- Name: product_exits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.product_exits_id_seq OWNED BY public.product_exits.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) DEFAULT 0.00 NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    min_stock integer DEFAULT 20 NOT NULL,
    quantity integer DEFAULT 0,
    barcode bigint,
    supplier character varying(255),
    entry_date date DEFAULT CURRENT_DATE,
    cost numeric(10,2) DEFAULT 0.00 NOT NULL,
    margin numeric(5,2) DEFAULT 40 NOT NULL
);


ALTER TABLE public.products OWNER TO admin;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO admin;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    matricula character varying(50) NOT NULL,
    senha character varying(255) NOT NULL,
    nivel character varying(50) NOT NULL,
    last_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: estoque codigo; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estoque ALTER COLUMN codigo SET DEFAULT nextval('public.estoque_codigo_seq'::regclass);


--
-- Name: product_entries id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_entries ALTER COLUMN id SET DEFAULT nextval('public.product_entries_id_seq'::regclass);


--
-- Name: product_exits id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_exits ALTER COLUMN id SET DEFAULT nextval('public.product_exits_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: estoque; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.estoque (codigo, descricao, fornecedor, data_entrada, quantidade_entrada, custo, data_saida, quantidade_saida, margem, valor_venda, saldo, estoque_minimo, criado_por, alterado_por, data_criacao, data_alteracao) FROM stdin;
1	Produto A	Fornecedor A	2025-01-01	100	50.00	\N	\N	\N	\N	0	20	admin	\N	2025-01-11 23:21:33.213819	\N
2	Produto B	Fornecedor B	2025-01-02	50	30.00	\N	\N	\N	\N	0	10	admin	\N	2025-01-11 23:21:33.213819	\N
\.


--
-- Data for Name: product_entries; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.product_entries (id, name, quantity, created_at, product_id, entry_date, cost) FROM stdin;
5	Café Itamaraty 500g	100	2025-02-02 19:34:48.047829	9	2025-02-02 00:00:00	0.00
9	Leite Lider Integral 1l	1200	2025-02-02 22:24:04.561458	20	2025-02-02 00:00:00	0.00
10	Leite Lider Integral 1l	360	2025-02-02 22:29:40.290982	20	2025-02-02 00:00:00	0.00
11	Leite Lider Integral 1l	600	2025-02-02 22:53:09.36868	20	2025-02-02 00:00:00	0.00
14	Café Itamaraty 500g	100	2025-02-06 15:05:06.387175	9	2025-02-06 15:05:06.387175	15.00
15	Café Itamaraty 500g	100	2025-02-06 17:50:32.536024	9	2025-02-06 17:50:32.536024	15.00
16	Café Itamaraty 500g	100	2025-02-06 17:59:24.005091	9	2025-02-06 17:59:24.005091	15.00
17	Filtro Café Melitta 103	200	2025-02-06 18:13:13.442159	10	2025-02-06 18:13:13.442159	3.00
\.


--
-- Data for Name: product_exits; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.product_exits (id, name, quantity, created_at, product_id) FROM stdin;
1	Produto A	5	2025-01-25 18:07:16.192801	\N
2	Produto B	3	2025-01-25 18:07:16.192801	\N
3	Café Itamaraty 500g	100	2025-02-02 20:21:12.781298	9
4	Filtro Café Melitta 103	80	2025-02-02 20:24:10.480126	10
8	Leite Lider Integral 1l	360	2025-02-02 22:25:00.141104	20
9	Leite Lider Integral 1l	360	2025-02-02 22:29:55.468746	20
10	Leite Lider Integral 1l	480	2025-02-02 22:53:38.618622	20
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.products (id, name, price, stock, min_stock, quantity, barcode, supplier, entry_date, cost, margin) FROM stdin;
4	Produto Teste	10.50	15	5	0	\N	\N	2025-02-01	0.00	40.00
5	Produto Teste	10.50	4	5	0	\N	\N	2025-02-01	0.00	40.00
11	Filtro de Café Bom Jesus 103	0.00	300	5	300	7896348300994	Bom Jesus	2025-02-01	2.00	40.00
12	Leite Integral Italac 1 L	4.05	1200	5	1200	7898080640611	Frísia	2025-02-01	3.00	35.00
20	Leite Lider Integral 1l	3.99	960	20	\N	7896569405515	Lider	2025-02-02	3.00	33.00
9	Café Itamaraty 500g	19.95	1000	5	950	7896045102495	Tres Corações	2025-02-02	15.00	35.00
10	Filtro Café Melitta 103	2.70	620	5	500	7891021001946	Melitta	2025-02-01	2.00	35.00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, nome, matricula, senha, nivel, last_login) FROM stdin;
2	Usuário Padrão	654321	$2b$10$gcMoWuR4DL3FLed8BEEI4eisqMi5jiT0J1TtsLLB72EHXZvzIbVDK	Usuário	2025-01-25 19:19:14.332006
3	Usuario Teste	147852	senha123	Usuário	\N
1	Admin Patrão	123456	$2b$10$fTIdSv2Oz7.fvh8fddnw3ef79AuBit57ib0A6UcwzEF2K1MN21raG	Supervisor	2025-02-04 19:47:12.864645
\.


--
-- Name: estoque_codigo_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.estoque_codigo_seq', 2, true);


--
-- Name: product_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.product_entries_id_seq', 17, true);


--
-- Name: product_exits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.product_exits_id_seq', 10, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: estoque estoque_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estoque
    ADD CONSTRAINT estoque_pkey PRIMARY KEY (codigo);


--
-- Name: product_entries product_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_entries
    ADD CONSTRAINT product_entries_pkey PRIMARY KEY (id);


--
-- Name: product_exits product_exits_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_exits
    ADD CONSTRAINT product_exits_pkey PRIMARY KEY (id);


--
-- Name: products products_barcode_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_barcode_key UNIQUE (barcode);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_matricula_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_matricula_key UNIQUE (matricula);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_products_barcode; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_products_barcode ON public.products USING btree (barcode);


--
-- Name: product_entries product_entries_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_entries
    ADD CONSTRAINT product_entries_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_exits product_exits_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_exits
    ADD CONSTRAINT product_exits_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

