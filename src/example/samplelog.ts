export const sampleLog = {
  id: "D01_250601",
  day: 1,
  date: "2025-06-01",
  ocf: {
    clips: [
      {
        clip: "A001C001_25062501",
        size: 2931447344,
        copies: [
          {
            volume: "Master_01",
            hash: "2ba3e5f63a5e63adbd626e1f5ef647fb",
          },
          {
            volume: "Backup_01",
            hash: "2ba3e5f63a5e63adbd626e1f5ef647fb",
          },
          {
            volume: "DIT_RAID_01",
            hash: "2ba3e5f63a5e63adbd626e1f5ef647fb",
          },
        ],
        tc_start: "08:48:37:15",
        tc_end: "08:49:52:14",
        duration: "00:00:14:23",
        camera_model: "Sony Venice",
        reel: "A001",
        fps: 24,
        sensor_fps: 24,
        lens: "40.00mm",
        shutter: 173,
        resolution: "8192x4320",
        codec: "X-OCN LT",
        gamma: "s-log3-cine",
        ei: 800,
        wb: 10000,
        tint: "0",
        lut: "SL3SG3Ctos709.cube",
      },
      {
        clip: "A001C002_25062502",
        size: 4967814704,
        copies: [
          {
            volume: "Master_01",
            hash: "22b0f4e72af880318da9bc7f4988033f",
          },
          {
            volume: "Backup_01",
            hash: "22b0f4e72af880318da9bc7f4988033f",
          },
          {
            volume: "DIT_RAID_01",
            hash: "22b0f4e72af880318da9bc7f4988033f",
          },
        ],
        tc_start: "08:49:07:11",
        tc_end: "08:49:22:10",
        duration: "00:00:14:23",
        camera_model: "Sony Venice",
        reel: "A002",
        fps: 25,
        sensor_fps: 25,
        lens: "40.00mm",
        shutter: 173,
        resolution: "8192x4320",
        codec: "X-OCN ST",
        gamma: "s-log3-cine",
        ei: 800,
        wb: 10000,
        tint: "0",
        lut: "SL3SG3Ctos709.cube",
      },
      {
        clip: "A001C003_25062503",
        size: 1977599976,
        copies: [
          {
            volume: "Master_01",
            hash: "3ba76f3f4f17c683eeaa8736ef826e43",
          },
          {
            volume: "Backup_01",
            hash: "3ba76f3f4f17c683eeaa8736ef826e43",
          },
          {
            volume: "DIT_RAID_01",
            hash: "3ba76f3f4f17c683eeaa8736ef826e43",
          },
        ],
        tc_start: "08:48:10:04",
        tc_end: "08:48:25:03",
        duration: "00:00:14:23",
        camera_model: "Sony Venice",
        reel: "A001",
        fps: 25,
        sensor_fps: 25,
        lens: "40.00mm",
        shutter: 173,
        resolution: "4096x2160",
        codec: "ProRes4444",
        gamma: "s-log3-cine",
        ei: 800,
        wb: 10000,
        tint: "0",
        lut: "SL3SG3Ctos709.cube",
      },
      {
        clip: "A001C004_25062504",
        size: 7251908144,
        copies: [
          {
            volume: "Master_01",
            hash: "c4ef49bb225771391a2f18e7aa7f86be",
          },
          {
            volume: "Backup_01",
            hash: "c4ef49bb225771391a2f18e7aa7f86be",
          },
          {
            volume: "DIT_RAID_01",
            hash: "c4ef49bb225771391a2f18e7aa7f86be",
          },
        ],
        tc_start: "08:49:44:09",
        tc_end: "08:49:59:08",
        duration: "00:00:14:23",
        camera_model: "Sony Venice",
        reel: "A001",
        fps: 25,
        sensor_fps: 25,
        lens: "40.00mm",
        shutter: 173,
        resolution: "8192x4320",
        codec: "X-OCN XT",
        gamma: "s-log3-cine",
        ei: 800,
        wb: 10000,
        tint: "0",
        lut: "SL3SG3Ctos709.cube",
      },
    ],
  },
  version: 1,
  custom: [
    {
      schema: "myCustomSchema",
      log: {
        director: "John Doe",
        dop: "Jane Doe",
      },
      clips: [
        {
          clip: "A001C001_25062501",
          CustomText: "CustomString",
          CustomTextList: ["applebox", "boom", "clapperboard"],
          CustomTextListList: [
            [
              "Johnny",
              "Bravo",
              "Gaffer",
              "Frequently uses a flashlight to check if lights are on",
            ],
            [
              "Jane",
              "Doe",
              "Video Assist",
              "Brings 500ft of BNC but always ends up 3ft short",
            ],
          ],
          CustomKVmap: {
            Location: "Studio 1",
            UserInfo1:
              "bananas, oat milk, 12 eggs, avocados (ripe, but not too ripe)",
          },

          CustomKVmapList: [
            {
              TC: "25:25:25.25",
              urgency: "0",
              issue: "digital dust",
            },
            {
              TC: "25:25:25.25",
              urgency: "2",
              issue:
                "Operator fell asleep here. Shot turned into 20 minutes of clouds",
            },
          ],
        },
        {
          clip: "A001C002_25062502",
          CustomText: "CustomString",
          CustomTextList: ["applebox", "boom", "clapperboard"],
          CustomTextListList: [
            [
              "Johnny",
              "Bravo",
              "Gaffer",
              "Frequently uses a flashlight to check if lights are on",
            ],
            [
              "Jane",
              "Doe",
              "Video Assist",
              "Brings 500ft of BNC but always ends up 3ft short",
            ],
          ],
          CustomKVmap: {
            Location: "Studio 1",
            UserInfo1:
              "bananas, oat milk, 12 eggs, avocados (ripe, but not too ripe)",
          },
          CustomKVmapList: [
            {
              TC: "01:23:45.67",
              urgency: "3",
              issue:
                "Camera overheated from 99th retake of actor pouring coffee. Director still not satisfied",
            },
          ],
        },
      ],
    },
  ],
};
