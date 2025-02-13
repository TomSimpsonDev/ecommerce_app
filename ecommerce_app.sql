--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Postgres.app)
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: items; Type: TABLE; Schema: public; Owner: tomsimpson
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name character varying,
    price double precision,
    in_stock boolean,
    stock_count integer,
    manufacturer_id integer,
    category character varying
);


ALTER TABLE public.items OWNER TO "tomsimpson";

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: tomsimpson
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO "tomsimpson";

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tomsimpson
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: manufacturers; Type: TABLE; Schema: public; Owner: tomsimpson
--

CREATE TABLE public.manufacturers (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.manufacturers OWNER TO "tomsimpson";

--
-- Name: manufacturers_id_seq; Type: SEQUENCE; Schema: public; Owner: tomsimpson
--

CREATE SEQUENCE public.manufacturers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.manufacturers_id_seq OWNER TO "tomsimpson";

--
-- Name: manufacturers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tomsimpson
--

ALTER SEQUENCE public.manufacturers_id_seq OWNED BY public.manufacturers.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: tomsimpson
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    date_time text,
    items text,
    total_cost double precision,
    user_email text
);


ALTER TABLE public.orders OWNER TO "tomsimpson";

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: tomsimpson
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO "tomsimpson";

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tomsimpson
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: tomsimpson
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text,
    hashed_password text,
    salt text,
    unhashed character varying
);


ALTER TABLE public.users OWNER TO "tomsimpson";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: tomsimpson
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "tomsimpson";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tomsimpson
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: manufacturers id; Type: DEFAULT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.manufacturers ALTER COLUMN id SET DEFAULT nextval('public.manufacturers_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: tomsimpson
--

COPY public.items (id, name, price, in_stock, stock_count, manufacturer_id, category) FROM stdin;
4	Apple Watch	409.99	t	1	3	Device
13	Mario 2	45.99	f	0	1	Videogame
1	Switch	249.99	t	17	1	Device
3	Necron Monolith	79.99	t	4	2	Model
5	iPhone 17 Pro Max XL	1799.99	t	1	3	Device
6	Ezreal skin no. 20837	100000.99	t	1000	4	Digital Cosmetic
29	Mario	49.99	t	87	1	Videogame
\.


--
-- Data for Name: manufacturers; Type: TABLE DATA; Schema: public; Owner: tomsimpson
--

COPY public.manufacturers (id, name) FROM stdin;
1	Nintendo
2	Games Workshop
3	Apple
4	Riot Games
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: tomsimpson
--

COPY public.orders (id, date_time, items, total_cost, user_email) FROM stdin;
3	2024-11-20 11:52:13.109555	[{"itemId":1,"itemName":"Switch","itemPrice":249.99,"quantity":1},{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":2}]	329.98	\N
4	2024-11-20 12:13:25.089773+00	[{"itemId":1,"itemName":"Switch","itemPrice":249.99,"quantity":1},{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":1}]	329.98	\N
5	2024-11-20 12:14:14.252369+00	[{"itemId":1,"itemName":"Switch","itemPrice":249.99,"quantity":3},{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":2}]	329.98	\N
6	2024-11-20 12:16:01.702878+00	[{"itemId":1,"itemName":"Switch","itemPrice":249.99,"quantity":0},{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":0}]	329.98	\N
7	2024-11-20 12:16:16.348638+00	[{"itemId":1,"itemName":"Switch","itemPrice":249.99,"quantity":0},{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":0}]	579.97	\N
8	2024-11-20 12:18:02.62774+00	[{"itemId":1,"itemName":"Switch","itemPrice":249.99,"quantity":2},{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":1}]	579.97	\N
9	2024-11-20 12:33:58.725763+00	[{"itemId":1,"itemName":"Switch","itemPrice":249.99,"quantity":1},{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":2}]	409.97	email@email.com
10	2024-11-20 15:02:31.244539+00	[{"itemId":3,"itemName":"Necron Monolith","itemPrice":79.99,"quantity":4}]	319.96	email@email.com
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tomsimpson
--

COPY public.users (id, username, hashed_password, salt, unhashed) FROM stdin;
1	me	password	1234	password
2	you	password	5678	password
3	user1	98799e2280d03c5e8866056aaebd68cf3987bf96910056e172e1bf6c61b924293a12e363a39586a5cd123104dd4ac4004cab8cea0e8c89eabfa68fd5a5aa8b30	fd94991b2f68337d3c4fecb14202a3ad29c969932d6f9e6232be9c6dc00f3901	password
4	user2	8145a1017cc2f9d55a7043362fdfd2ad2bf825c0691f9c5ba4fc2ba193300521a0a1cf06449632e3a86b38597cc03a5fc0ef88abe4d16f77e339c3f03267c4aa	39e3bac0659367367526136a3d93545d6a3d0119929e448b11ef4d6f94f9688f	password
12	user3	9ad24efd36ea30c9dc1784bb7f6cbb321c94bb12be58ade9149dc98bda5e974de6649df70865a4043f81b82d0aeb368d8cfabedc6bde3cd3962cd5059929913e	255f4259cc8e26f399416bec1b4f2221990d651ecacacb1a2454af6ada925b6a	password
13	user4	bb17d7fd31bf18e305601d7f19e5cdf8087b7ccef3ea90d1eac0b3828983158f9cefae735ec12d479920354ed47b74796277f92aa4521f77da8f6695dab18b51	703e0eccef9656c03e4f5c555b0393cb9f531115b3db6adf96b1031a555d88fb	password
14	user5	4a559857c8c8fcd88f54920185af1ccbda9c76e6c87ddc6a5728aedf42814cd06a4a6a261d536bdc74a4ad38506226882d9ba10266debb79592d75c2460d42d9	f31d4abc4fda0a90e13fa1cc0b455d3a7433e6e66f35922ecf742a6234c3dc57	password
15	user6	b3091678b2f2c4b45f2dafc3994ec8c951e0f2d7ffcc75cf3c3e874af96baaeb5519fd311862e0c8c360abf6c2a20d3aabf0b275bcd530208f8edf5c46da0e63	503b52d7333318a06a45e923580d95ded5260d9ff792265b85d098fc006ecab6	password
16	user7	2af39c99c313ad3c2c946e8b41861db814a36162ede3d5318ebbf6daf62283992b01e11ab8756eceffc395f4533a441e7e6fae0e418e79060d1e344767301e84	1c8aeb646a60a0ef19e8691485c6b984f283c73a08efc98c7fc5fc7ceecc81d1	password
17	user8	87d59dd684ada3a9a30eb87d57ee4e393c303ddbe6d6fb6ebfe946bc731c84ffaf15e6fde4e373fe7aa5f8c8247880744896c5485ad47c4f88e42b0287930a71	b3a6ed26835942fb8056cf752dd7e2b71ddc44d1a77ea61658997b568ae239b7	password
19	user10	8777ca5b00f2dc62c27c0bdf18b8397984f5c56b8e8115ea8832d001945cb93b520d1b1ba6c7d47811bbdf4917b1bc7275e75b814538a934047d38d446736d35	32b265916b4ffca7cdf2f92d99c9a06d30f009e3e601ede9fa1ed2b056076cd9	password
20	user11	ccc83831fe31bf1c5ca144e801a7fa37693a0cb8cb4340f45da1d5ef408295be6652d0f5c0d35f3af185d4857aed0bb2f858c8a8bbf22a7e9360efa8db106925	322cc502b64a4cd68220f09ea4f6135b9ae3f567807b6d68e3e3bf946c5b4572	password
18	user3000	fnjeirlehtwubhuvbhrtw	21	password
21	user12	b356aa44b4803be144fd7409bf3cfe49c3f752efe7685506637df4016a178439d0e58746df95c32717dde525a9f7f3ff50e78959eccdaa4f442c5fd59f8f4aae	6996b8db6e136d03bd91d940d6d54121b969cc125bdc6749e551468175a484d7	password
22	user13	767ce5a8b1d84e20b38afa5862fa0dd5236b8636498dbe18540be999b8eed90856fb2fe6cb1cec167d55d43518b5d1f181f820dfa23dac0bfb02a5bc477ebe88	7433fea636309752e0fcef1a901b728a5a29d36073806c3efda19d64fdf812ca	password
23	user14	6b9bebc582a56f5f9f6306fd87812b66abcf5ba979feb93e653595d35349a74f318d4e123a760524e5f9be4558a452c2a81fe2d7e368deff8477a377ce8032ca	ab009a565107d24fdca97726922ff2ed25bd12c9222c68f21985b43c05e94401	password
\.


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tomsimpson
--

SELECT pg_catalog.setval('public.items_id_seq', 29, true);


--
-- Name: manufacturers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tomsimpson
--

SELECT pg_catalog.setval('public.manufacturers_id_seq', 4, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tomsimpson
--

SELECT pg_catalog.setval('public.orders_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tomsimpson
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: manufacturers manufacturers_pkey; Type: CONSTRAINT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.manufacturers
    ADD CONSTRAINT manufacturers_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: items items_manufacturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tomsimpson
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_manufacturer_id_fkey FOREIGN KEY (manufacturer_id) REFERENCES public.manufacturers(id);


--
-- PostgreSQL database dump complete
--

