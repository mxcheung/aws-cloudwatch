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
only scan until threshold exceeded
```
START RequestId: 35a3a549-1a11-4bf0-b3d3-0a4955612666 Version: $LATEST
[INFO]	2024-10-28T20:49:04.325Z	35a3a549-1a11-4bf0-b3d3-0a4955612666	Current expired count: 6969
[INFO]	2024-10-28T20:49:04.534Z	35a3a549-1a11-4bf0-b3d3-0a4955612666	Published message to SNS: Threshold of 100 expired transactions met. Count: 6969
[INFO]	2024-10-28T20:49:04.534Z	35a3a549-1a11-4bf0-b3d3-0a4955612666	Total pagination requests made: 0
END RequestId: 35a3a549-1a11-4bf0-b3d3-0a4955612666
REPORT RequestId: 35a3a549-1a11-4bf0-b3d3-0a4955612666	Duration: 2820.87 ms	Billed Duration: 2821 ms	Memory Size: 128 MB	Max Memory Used: 95 MB
```


## Get live count
```
Item count
21,450
Scan status
Complete
Last updated
October 29, 2024 07:48:05
```
