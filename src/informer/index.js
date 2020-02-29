const k8s = require('@kubernetes/client-node');
const redis = require('redis')

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const client = redis.createClient({ host: process.env.REDIS_HOST })

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const informer = k8s.makeInformer(kc, '/api/v1/pods', () => {
  return k8sApi.listPodForAllNamespaces(undefined, undefined, 'metadata.namespace!=kube-system,metadata.namespace!=local-path-storage,metadata.namespace!=kinf,status.phase=Running')
})

informer.on('add', obj => client.lpush(process.env.ADD_QUEUE_NAME, JSON.stringify(obj), redis.print))
informer.on('update', obj => client.lpush(process.env.ADD_QUEUE_NAME, JSON.stringify(obj), redis.print))

// On error restart the informer after 5 seconds
informer.on('error', (err) => {
  console.error(err);
  setTimeout(() => {
    console.info("Restart informer now...");
    informer.start();
  }, 5000);
});

informer.start()
console.log("Informer started...")

