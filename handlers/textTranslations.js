const { Translations, Suggestions } = require("../models");
const { catchError } = require("../utils/quickFunctions");

exports.searchTranslation = async (req, res) => {
  try {
    const { sourceText, sourceLanguage, translationLanguage } = req.body;

    const searchOption = [
      {
        $search:
          sourceText.length > 6
            ? {
                // phrase: {
                //   query: sourceText,
                //   path: souSrceLanguage.toLowerCase(),
                // },
                text: {
                  query: sourceText,
                  path: sourceLanguage.toLowerCase(),
                  fuzzy: {},
                },
              }
            : {
                index: "lessThanSixChars",
                compound: {
                  must: [
                    {
                      text: {
                        query: sourceText,
                        path: sourceLanguage.toLowerCase(),
                        score: { boost: { value: 5 } },
                      },
                    },

                    {
                      autocomplete: {
                        query: sourceText,
                        path: sourceLanguage.toLowerCase(),
                      },
                    },
                  ],
                },
              },
      },
      {
        // $project: translationLanguage === "French" ? { french: 1 } : translationLanguage === "Spanish" ? { spanish: 1 } : { english: 1 },

        $project: {
          french: 1,
          english: 1,
          spanish: 1,
          // score: { $meta: "searchScore" }
        },
      },
      { $limit: 1 },
    ];

    const result = await Translations.aggregate(searchOption).toArray();

    // const translation = result && result[0] ? result[0][`${translationLanguage.toLowerCase()}`] : "no translation found";

    const translation =
      result && result[0]
        ? {
            query: sourceText,
            _id: result[0]._id,
            english: result[0].english,
            result: result[0][translationLanguage.toLowerCase()],
          }
        : {
            query: sourceText,
            result: "no translation found",
            // result: "",
          };

    res.status(200).json(translation);
  } catch (err) {
    return catchError({ res, err, message: err.message || "translation not found" });
  }
};

exports.suggestTranslation = async (req, res) => {
  try {
    const { sourceText, sourceLanguage, translationText, translationLanguage, translationId, suggestedTranslation } = req.body;

    await Suggestions.insertOne({
      sourceText,
      sourceLanguage,
      translationText,
      translationLanguage,
      translationId,
      suggestedTranslation,
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    return catchError({ res, err, message: err.message || "Suggestion not sent" });
  }
};

exports.starter = async (req, res) => {
  try {
    res.status(200).json("successful");
  } catch (err) {
    return catchError({ res, err, message: err.message || "An error occured" });
  }
};
