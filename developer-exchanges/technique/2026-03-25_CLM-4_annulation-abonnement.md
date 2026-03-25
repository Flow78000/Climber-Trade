# CLM-4 — Gestion de l'annulation d'abonnement

- **Date :** 2026-03-25
- **Statut :** `ACTION`
- **Priorite :** Haute
- **Theme :** technique
- **YouTrack :** CLM-4

---

## Contexte

Il n'existe pas d'option permettant a l'utilisateur d'annuler lui-meme son abonnement pour en souscrire un nouveau.

---

## Ce qui a ete demande a Alex

Permettre a l'utilisateur d'annuler son abonnement depuis le dashboard. A l'annulation, supprimer le compte de trading de l'utilisateur tout en conservant l'historique des resultats en base de donnees. Passer l'abonnement aMember en statut "expired" afin qu'il ne s'affiche plus dans le dashboard et permette une nouvelle souscription. Prevoir en BDD la conservation des resultats du dernier compte annule/failed pour un futur onglet "History" dans le dashboard.

---

## Reponse d'Alex

_En cours d'implementation._

**Date reponse :** —

---

## Analyse / Comprehension

Points cles :
- L'historique doit etre conserve en BDD (jamais supprime)
- Le statut aMember doit passer en "expired" (pas "cancelled")
- Un futur onglet "History" est prevu pour afficher les anciens comptes

---

## Donnees importantes a retenir

- Statut aMember cible : "expired"
- Conservation BDD : historique resultats du dernier compte
- Futur onglet : "History" dans le dashboard
- Lie a CLM-5 (flow de reabonnement apres echec)
- Lie a CLM-52 (annulation datafeeds en cascade)

---

## Actions a suivre

- [ ] Valider l'implementation d'Alex
- [ ] Tester le flow complet : annulation -> statut expired -> nouvelle souscription possible
- [ ] Verifier la conservation des donnees historiques en BDD
- [ ] Verifier que CLM-52 est gere (annulation datafeeds en cascade)
