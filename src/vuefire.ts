import { firestoreDefaultConverter, globalFirestoreOptions } from 'vuefire';

globalFirestoreOptions.converter = {
  // the default converter just returns the data: (data) => data
  toFirestore: firestoreDefaultConverter.toFirestore,
  fromFirestore: (snapshot, options) => {
    const data = firestoreDefaultConverter.fromFirestore(snapshot, options);
    // if the document doesn't exist, return null
    if (!data) return null;
    // add anything custom to the returned object
    data.metadata = snapshot.metadata;
    return data;
  },
};
