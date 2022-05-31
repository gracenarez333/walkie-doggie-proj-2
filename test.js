const axios = require('axios')

const testData = async () => {
    try {
        const url = "https://api.petfinder.com/v2/animals"
        const response = await axios({
          method: "get",
          url: url,
          headers: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6IjQ4ODhkOGI1ODQ1ZTQ5MjMxNjhhYzBiOGFmMGVjZTE0M2M0ODJjMzZlNjRlMzExNGNiOGI5MDAyMGUwYjAxYjAwNzBkNDMwYmU5Yjk0NGNhIiwiaWF0IjoxNjUzOTY3ODU2LCJuYmYiOjE2NTM5Njc4NTYsImV4cCI6MTY1Mzk3MTQ1Niwic3ViIjoiIiwic2NvcGVzIjpbXX0.U5oyULC3yr6C97qF8vx59ONrqyXoF5oxlCqAxtNW6VhtVvN5-5o8JMAHlrpGEDLwzfDoEhN3ave-E7wtVOsCsny9d07biCsdsMF39YmvSNFs430QlIbS3DGlljr41AzvKplrs6NmJCMl24TOarDcTUajrH8ldAwgXRE1S2fL3wKWJDi2ubaRwGMouQqx89aVF2nV0-_sK1hADPU8a6J_WJklfeeiROUJQyZo720WmUsUFoDB49OXO9tnWR99Jzv0xJPKklQpM3hNb1m28j5enAvEPxS4Ovtka2xdkzEgKxkj_dcbwbkonyXFi1AdLHlvSbn_91BOppHAoDwoBFcpPg",
          },
        });
        console.log(response.data.animals)
    } catch (error) {
        console.log(error)
    }
}
testData()
