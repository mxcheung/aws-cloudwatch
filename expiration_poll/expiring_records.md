# metrics using ec2
## ec

```
t3.small or t3.medium
30 gb
```
```
ssh -i "MyKeyPair.pem" ec2-user@ec2-54-234-111-22.compute-1.amazonaws.com
sudo yum -y install git
git clone https://github.com/mxcheung/aws-cloudwatch.git
cd /home/ec2-user/aws-cloudwatch/expiration_ttl
. ./set_up.sh
```


## quick start

https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#LaunchInstances:

Instance Type:
   - t3.medium

Key pair (login) 
   - MyKeyPair.pem

Network settings
  - Allow SSH traffic from
  - Allow HTTPS traffic from the internet
  - Allow HTTP traffic from the internet

Configure storage
  - 30gb




## Test polling lambda
```
START RequestId: 95e93e12-b50e-4feb-bf38-0ec4b7018d0c Version: $LATEST
[INFO]	2024-10-28T20:32:31.674Z	95e93e12-b50e-4feb-bf38-0ec4b7018d0c	Current expired count: 1994
[INFO]	2024-10-28T20:32:31.920Z	95e93e12-b50e-4feb-bf38-0ec4b7018d0c	Published message to SNS: Threshold of 100 expired transactions met. Count: 1994
END RequestId: 95e93e12-b50e-4feb-bf38-0ec4b7018d0c
REPORT RequestId: 95e93e12-b50e-4feb-bf38-0ec4b7018d0c	Duration: 1644.99 ms	Billed Duration: 1645 ms	Memory Size: 128 MB	Max Memory Used: 82 MB	Init Duration: 443.72 ms
```
