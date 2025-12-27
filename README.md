#  AssessAI – Système Automatique de Correction et d’Évaluation de Copies
![logo jf](https://github.com/user-attachments/assets/1549142f-f9b3-4978-9afd-a206aee947c3)
## INTRODUCTION
**AssessAI** est une plateforme intelligente de correction automatique des copies d’examen (PDF), basée sur une **architecture microservices** et exploitant des techniques d’**OCR**, de **NLP**, de **scoring automatique** et de **feedback pédagogique**.
## OBJECTIFS DU PROJET ASSESSAI
**L’objectif principal de AssessAI est de :**
- Automatiser la correction des copies d’examens
- Réduire le temps et l’effort des enseignants
- Garantir une évaluation plus objective et cohérente
- Fournir un feedback clair et pédagogique aux étudiants
- Exploiter l’intelligence artificielle dans le domaine de l’éducation
##  Fonctionnalités principales
###  Espace Enseignant :
Saisie de la **réponse modèle (reference answer)**
- Upload des copies d’examen au format **PDF**
- Extraction automatique du texte (OCR)
- Analyse linguistique des réponses (NLP)
- Calcul automatique de la note (/20)
- Génération d’un **feedback détaillé**
- Visualisation d’un **rapport global** sous forme de tableau
- Export des résultats au format **CSV**
###  Espace Étudiant :
- Connexion simple (mode démo)
- Consultation de la note finale
- Accès uniquement à son **feedback personnel**
- Confidentialité des résultats des autres étudiants
## Architecture golbale :
###  Architecture de Assessia web:
![react](https://github.com/user-attachments/assets/833a7d48-7219-4f48-8611-f9ac5e30d65e)
###  Architecture de Assessia mobile:

### Structure du projet :
<img width="574" height="729" alt="image" src="https://github.com/user-attachments/assets/6114dc56-5063-4a1b-a70c-54547f20ced2" />


##  Microservices
###  1. API Gateway
**- Technologie : Spring Cloud Gateway** 
**- Port : `8081`**
**- Rôle :**
  - Point d’entrée unique
  - Routage des requêtes
  - Load balancing via Eureka
###  2. OCR Service
**- Port : `8082`**
**- Rôle :** 
  - Lecture des fichiers PDF
  - Extraction du texte via OCR
**- Technologies :**
  - Tesseract (Tess4J)
  - Apache PDFBox
**- Endpoint :**
```http
**POST /ocr/process** 
Content-Type: multipart/form-data
```
###  3. NLP Service
**Port : 8083** 
**Rôle :**
Analyse linguistique du texte extrait
Nettoyage, normalisation, mots-clés
**Endpoint :**
```
POST /nlp/analyze
```
###  4. Scoring Service
**Port : 8084**
**Rôle :**
Comparaison entre la réponse de l’étudiant et la réponse modèle
Calcul automatique de la note sur 20
**Endpoint :**
```
POST /scoring/evaluate
```
 ### 5. Feedback Service
**Port : 8085**
**Rôle :**
Génération d’un feedback pédagogique personnalisé
Explication de la note obtenue
**Endpoint :**
```
POST /feedback/generate
```
 ### 6. Eureka Server
**Port : 8761**
**Rôle :**
Service Registry
Découverte automatique des microservices
 ### Framework : React + Vite
**UI : Tailwind CSS** 
Routing : React Router
Communication HTTP : Axios
Gestion d’état : Context API
Stockage : LocalStorage (mode démo)
 ### Pages principales
/login
/teacher
![Capture d’écran_27-12-2025_164626_localhost](https://github.com/user-attachments/assets/eea95846-6074-4048-8e95-30b13e8fe31b)
/student
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/1d532c88-39e9-472a-9c44-6051fce01e29" />
 ###  Technologies utilisées
 #### Backend
-Java  21

-Spring Boot

-Spring Cloud (Gateway, Eureka)

-Spring AMQP (RabbitMQ)

-Maven

-SonarQube (qualité du code)

 #### Frontend
-React

-Vite

-Tailwind CSS

-Axios

-Intelligence Artificielle

-OCR : Tesseract

-PDF processing : Apache PDFBox

-NLP : Stanford CoreNLP / logique personnalisée

 #### DevOps & Outils
-Docker (optionnel)

-SonarQube

-Git / GitHub

-IntelliJ IDEA

- Rabbitmq
 ### Lancement du projet :
 ### Backend  
  ### Eureka
 ![Capture d’écran_27-12-2025_154136_localhost](https://github.com/user-attachments/assets/78574788-3a9a-485b-b712-10ff39e44a3d)
  ### rabbitmq
 ![Capture d’écran_27-12-2025_154218_localhost](https://github.com/user-attachments/assets/8360ba1b-3f9d-4ea1-96a6-5d6768aa9274)
![Capture d’écran_27-12-2025_154244_localhost](https://github.com/user-attachments/assets/7322e0ca-8fec-470d-9315-7ffa4498e50d)

  ### base de donne Mysql:
  ### OCR:
  <img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/013ddac1-25e9-4b89-be23-521cd0f0e7e8" />
   ### feedback:
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/6c86f10a-e778-44dc-a3b8-c64c148f01a2" />
 ### 2️ Frontend
 ## Espace de enseignent
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/780be9bc-682b-44e7-956c-95f99a50293d" />
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/012f1b6c-0a20-4833-8aa2-b177d4c83496" />
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/4feec239-5f4c-4de1-989b-fabe2665f606" />
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/61734a9c-8531-42b9-bc1b-e18c754b03fe" />
## Espace de etudiante
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/84015241-f5f4-472e-a38b-845c2385b15c" />
## video :




https://github.com/user-attachments/assets/2ae832e2-b6d8-4932-909a-8d4b97339cb1



## CONCULSION:

Le projet AssessAI illustre l’apport concret des technologies émergentes dans le domaine de l’éducation, en proposant une solution complète d’automatisation de la correction et de l’évaluation des copies d’examen. Grâce à une architecture microservices robuste et évolutive, le système intègre efficacement des techniques d’OCR, de traitement automatique du langage naturel (NLP), de scoring automatique et de génération de feedback pédagogique.
L’utilisation de Spring Boot, Spring Cloud, React, ainsi que des outils d’IA permet de garantir une solution modulaire, scalable et maintenable, tout en offrant une expérience utilisateur claire et intuitive pour les enseignants et les étudiants. De plus, l’intégration d’outils de qualité de code tels que SonarQube renforce la fiabilité et la maintenabilité du projet.
Enfin, AssessAI constitue une base solide pour des évolutions futures, notamment l’intégration de modèles d’intelligence artificielle plus avancés, une authentification sécurisée, et un déploiement à grande échelle dans des environnements cloud. Ce projet démontre ainsi le potentiel de l’IA comme levier d’innovation pédagogique et d’amélioration des pratiques d’évaluation dans l’enseignement moderne

## 👩‍💻 Réalisé dans le cadre de
 ### jamila dabachine et fatima ezzahra ghanimi
 ### Master : Technologies Émergentes en Éducation
 ### ENS Marrakech
 ## 📜 Licence
Projet académique AssessIA – Usage pédagogique uniquement







 



